const express = require("express");

const pool = require("../db");

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// GET ALL PRODUCTS
// GET /api/products
// ============================================================

router.get("/", async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = `
            SELECT *
            FROM products
        `;

        const values = [];
        const conditions = [];

        if (search) {
            values.push(`%${search}%`);

            conditions.push(`
                (
                    name ILIKE $${values.length}
                    OR description ILIKE $${values.length}
                )
            `);
        }

        if (category) {
            values.push(category);

            conditions.push(
                `category = $${values.length}`
            );
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY id DESC";

        const result = await pool.query(query, values);

        res.json(result.rows);

    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
});


// ============================================================
// GET PRODUCT CATEGORIES
// GET /api/products/categories
// ============================================================

router.get("/categories", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT category
            FROM products
            WHERE category IS NOT NULL
            AND category != ''
            ORDER BY category
        `);

        res.json(
            result.rows.map(row => row.category)
        );

    } catch (error) {
        console.error("GET CATEGORIES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch categories"
        });
    }
});


// ============================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ============================================================

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM products
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("GET PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch product"
        });
    }
});


// ============================================================
// CREATE PRODUCT
// POST /api/products
// ADMIN ONLY
// ============================================================

router.post(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                name,
                description,
                price,
                image,
                category,
                stock
            } = req.body;

            if (!name || price === undefined) {
                return res.status(400).json({
                    message: "Name and price are required"
                });
            }

            if (Number(price) < 0) {
                return res.status(400).json({
                    message: "Price cannot be negative"
                });
            }

            if (stock !== undefined && Number(stock) < 0) {
                return res.status(400).json({
                    message: "Stock cannot be negative"
                });
            }

            const result = await pool.query(
                `
                INSERT INTO products
                (
                    name,
                    description,
                    price,
                    image,
                    category,
                    stock
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
                `,
                [
                    name.trim(),
                    description || "",
                    Number(price),
                    image || "",
                    category || "Sarees",
                    stock === undefined ? 0 : Number(stock)
                ]
            );

            res.status(201).json({
                message: "Product created successfully",
                product: result.rows[0]
            });

        } catch (error) {
            console.error("CREATE PRODUCT ERROR:", error);

            res.status(500).json({
                message: "Failed to create product"
            });
        }
    }
);


// ============================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ADMIN ONLY
// ============================================================

router.put(
    "/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                name,
                description,
                price,
                image,
                category,
                stock
            } = req.body;

            if (!name || price === undefined) {
                return res.status(400).json({
                    message: "Name and price are required"
                });
            }

            if (Number(price) < 0) {
                return res.status(400).json({
                    message: "Price cannot be negative"
                });
            }

            if (Number(stock) < 0) {
                return res.status(400).json({
                    message: "Stock cannot be negative"
                });
            }

            const result = await pool.query(
                `
                UPDATE products
                SET
                    name = $1,
                    description = $2,
                    price = $3,
                    image = $4,
                    category = $5,
                    stock = $6
                WHERE id = $7
                RETURNING *
                `,
                [
                    name.trim(),
                    description || "",
                    Number(price),
                    image || "",
                    category || "Sarees",
                    Number(stock),
                    id
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json({
                message: "Product updated successfully",
                product: result.rows[0]
            });

        } catch (error) {
            console.error("UPDATE PRODUCT ERROR:", error);

            res.status(500).json({
                message: "Failed to update product"
            });
        }
    }
);


// ============================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ADMIN ONLY
// ============================================================

router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await pool.query(
                `
                DELETE FROM products
                WHERE id = $1
                RETURNING *
                `,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json({
                message: "Product deleted successfully"
            });

        } catch (error) {
            console.error("DELETE PRODUCT ERROR:", error);

            res.status(500).json({
                message: "Failed to delete product"
            });
        }
    }
);


module.exports = router;