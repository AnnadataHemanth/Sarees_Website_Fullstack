const express = require("express");
const pool = require("../db");

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// CREATE ORDER
// POST /api/orders
// ============================================================

router.post("/", authenticateToken, async (req, res) => {
    const client = await pool.connect();

    try {
        const body = req.body || {};

        const customerName =
            body.customer_name ||
            body.customerName ||
            body.name ||
            "";

        const phone = body.phone || "";
        const address = body.address || "";

        const items =
            Array.isArray(body.items)
                ? body.items
                : Array.isArray(body.cartItems)
                    ? body.cartItems
                    : [];

        const cleanName = String(customerName).trim();
        const cleanPhone = String(phone).trim();
        const cleanAddress = String(address).trim();

        if (
            !cleanName ||
            !cleanPhone ||
            !cleanAddress ||
            items.length === 0
        ) {
            return res.status(400).json({
                message:
                    "Name, phone, address and items are required"
            });
        }

        await client.query("BEGIN");

        let total = 0;
        const orderItems = [];

        // --------------------------------------------------------
        // Validate products and calculate total
        // --------------------------------------------------------

        for (const item of items) {
            const productId = Number(
                item.product_id ?? item.productId ?? item.id
            );

            const quantity = Number(
                item.quantity ?? 1
            );

            if (
                !Number.isInteger(productId) ||
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                throw new Error(
                    "Invalid product or quantity"
                );
            }

            const productResult = await client.query(
                `
                SELECT id, name, price, stock
                FROM products
                WHERE id = $1
                FOR UPDATE
                `,
                [productId]
            );

            if (productResult.rows.length === 0) {
                throw new Error(
                    `Product ${productId} not found`
                );
            }

            const product = productResult.rows[0];

            if (Number(product.stock) < quantity) {
                throw new Error(
                    `Not enough stock for ${product.name}`
                );
            }

            const price = Number(product.price);

            total += price * quantity;

            orderItems.push({
                product_id: product.id,
                product_name: product.name,
                price,
                quantity
            });
        }

        // --------------------------------------------------------
        // Create order
        // --------------------------------------------------------

        const orderResult = await client.query(
            `
            INSERT INTO orders
            (
                user_id,
                customer_name,
                phone,
                address,
                total,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                req.user.id,
                cleanName,
                cleanPhone,
                cleanAddress,
                total,
                "Pending"
            ]
        );

        const order = orderResult.rows[0];

        // --------------------------------------------------------
        // Create order items and reduce stock
        // --------------------------------------------------------

        for (const item of orderItems) {
            await client.query(
                `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    product_name,
                    price,
                    quantity
                )
                VALUES ($1, $2, $3, $4, $5)
                `,
                [
                    order.id,
                    item.product_id,
                    item.product_name,
                    item.price,
                    item.quantity
                ]
            );

            await client.query(
                `
                UPDATE products
                SET stock = stock - $1
                WHERE id = $2
                `,
                [
                    item.quantity,
                    item.product_id
                ]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            message: "Order placed successfully",
            order: {
                ...order,
                total: Number(order.total)
            },
            items: orderItems
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("CREATE ORDER ERROR:", error);

        res.status(400).json({
            message:
                error.message ||
                "Failed to place order"
        });

    } finally {
        client.release();
    }
});


// ============================================================
// GET MY ORDERS
// GET /api/orders/my-orders
// ============================================================

router.get(
    "/my-orders",
    authenticateToken,
    async (req, res) => {
        try {
            const ordersResult = await pool.query(
                `
                SELECT *
                FROM orders
                WHERE user_id = $1
                ORDER BY created_at DESC
                `,
                [req.user.id]
            );

            const orders = [];

            for (const order of ordersResult.rows) {
                const itemsResult = await pool.query(
                    `
                    SELECT *
                    FROM order_items
                    WHERE order_id = $1
                    ORDER BY id
                    `,
                    [order.id]
                );

                orders.push({
                    ...order,
                    total: Number(order.total),
                    items: itemsResult.rows
                });
            }

            res.json(orders);

        } catch (error) {
            console.error("MY ORDERS ERROR:", error);

            res.status(500).json({
                message: "Failed to fetch orders"
            });
        }
    }
);


// ============================================================
// ADMIN - GET ALL ORDERS
// GET /api/orders/admin/all
// ============================================================

router.get(
    "/admin/all",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const ordersResult = await pool.query(
                `
                SELECT
                    orders.*,
                    users.email AS user_email
                FROM orders
                LEFT JOIN users
                    ON orders.user_id = users.id
                ORDER BY orders.created_at DESC
                `
            );

            const orders = [];

            for (const order of ordersResult.rows) {
                const itemsResult = await pool.query(
                    `
                    SELECT *
                    FROM order_items
                    WHERE order_id = $1
                    ORDER BY id
                    `,
                    [order.id]
                );

                orders.push({
                    ...order,
                    total: Number(order.total),
                    items: itemsResult.rows
                });
            }

            res.json(orders);

        } catch (error) {
            console.error("ADMIN ORDERS ERROR:", error);

            res.status(500).json({
                message: "Failed to fetch orders"
            });
        }
    }
);


// ============================================================
// ADMIN - UPDATE ORDER STATUS
// PUT /api/orders/admin/:id/status
// ============================================================

router.put(
    "/admin/:id/status",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body || {};

            const allowedStatuses = [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid order status"
                });
            }

            const result = await pool.query(
                `
                UPDATE orders
                SET status = $1
                WHERE id = $2
                RETURNING *
                `,
                [status, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            res.json({
                message: "Order status updated successfully",
                order: result.rows[0]
            });

        } catch (error) {
            console.error(
                "UPDATE ORDER STATUS ERROR:",
                error
            );

            res.status(500).json({
                message: "Failed to update order status"
            });
        }
    }
);


// ============================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// ============================================================

router.get(
    "/:id",
    authenticateToken,
    async (req, res) => {
        try {
            const { id } = req.params;

            const orderResult = await pool.query(
                `
                SELECT *
                FROM orders
                WHERE id = $1
                AND user_id = $2
                `,
                [id, req.user.id]
            );

            if (orderResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            const itemsResult = await pool.query(
                `
                SELECT *
                FROM order_items
                WHERE order_id = $1
                ORDER BY id
                `,
                [id]
            );

            res.json({
                ...orderResult.rows[0],
                total: Number(
                    orderResult.rows[0].total
                ),
                items: itemsResult.rows
            });

        } catch (error) {
            console.error("GET ORDER ERROR:", error);

            res.status(500).json({
                message: "Failed to fetch order"
            });
        }
    }
);


module.exports = router;