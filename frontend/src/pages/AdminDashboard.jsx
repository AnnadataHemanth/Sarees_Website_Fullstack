import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "Sarees",
        stock: "",
    });

    const token = localStorage.getItem("token");

    const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    // =========================================================
    // LOAD DASHBOARD DATA
    // =========================================================

    const loadData = async () => {
        try {
            setError("");

            const [productsResponse, ordersResponse] =
                await Promise.all([
                    fetch(`${API_URL}/products`),

                    fetch(`${API_URL}/orders/admin/all`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);

            if (
                productsResponse.status === 401 ||
                productsResponse.status === 403 ||
                ordersResponse.status === 401 ||
                ordersResponse.status === 403
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
                return;
            }

            const productsData =
                await productsResponse.json();

            const ordersData =
                await ordersResponse.json();

            if (!productsResponse.ok) {
                throw new Error(
                    productsData.message ||
                    "Failed to load products"
                );
            }

            if (!ordersResponse.ok) {
                throw new Error(
                    ordersData.message ||
                    "Failed to load orders"
                );
            }

            setProducts(
                Array.isArray(productsData)
                    ? productsData
                    : productsData.products || []
            );

            setOrders(
                Array.isArray(ordersData)
                    ? ordersData
                    : ordersData.orders || []
            );

        } catch (err) {
            console.error(
                "ADMIN DASHBOARD ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to load admin data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadData();
    }, []);

    // =========================================================
    // FORM
    // =========================================================

    const handleChange = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]:
                event.target.value,
        }));
    };

    // =========================================================
    // ADD PRODUCT
    // =========================================================

    const addProduct = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/products`,
                {
                    method: "POST",
                    headers: authHeaders,

                    body: JSON.stringify({
                        name: form.name.trim(),
                        description:
                            form.description.trim(),
                        price: Number(form.price),
                        image: form.image.trim(),
                        category:
                            form.category.trim() ||
                            "Sarees",
                        stock: Number(form.stock),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to add product"
                );
            }

            setForm({
                name: "",
                description: "",
                price: "",
                image: "",
                category: "Sarees",
                stock: "",
            });

            setMessage(
                "Product added successfully."
            );

            await loadData();

            document
                .getElementById("products")
                ?.scrollIntoView({
                    behavior: "smooth",
                });

        } catch (err) {
            console.error(
                "ADD PRODUCT ERROR:",
                err
            );

            setError(err.message);
        }
    };

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    const deleteProduct = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/products/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete product"
                );
            }

            setMessage(
                "Product deleted successfully."
            );

            await loadData();

        } catch (err) {
            console.error(
                "DELETE PRODUCT ERROR:",
                err
            );

            setError(err.message);
        }
    };

    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================

    const updateOrderStatus = async (
        orderId,
        status
    ) => {
        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/orders/admin/${orderId}/status`,
                {
                    method: "PUT",

                    headers: authHeaders,

                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update order status"
                );
            }

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId
                        ? {
                              ...order,
                              status,
                          }
                        : order
                )
            );

            setMessage(
                `Order #${orderId} updated to ${status}.`
            );

        } catch (err) {
            console.error(
                "UPDATE ORDER ERROR:",
                err
            );

            setError(err.message);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <main className="page-center">
                <p>
                    Loading admin dashboard...
                </p>
            </main>
        );
    }

    // =========================================================
    // DASHBOARD
    // =========================================================

    return (
        <main className="admin-page">

            {/* =================================================
                ADMIN HEADER
            ================================================= */}

            <header className="admin-hero">

                <p className="section-eyebrow">
                    SAAVITHRI HANDLOOMS
                </p>

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Manage products, inventory and customer orders.
                </p>

            </header>


            <div className="admin-content">

                {/* =================================================
                    MESSAGES
                ================================================= */}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}


                {/* =================================================
                    STATS
                ================================================= */}

                <section className="admin-stats">

                    <div className="admin-stat">
                        <span className="admin-stat-label">
                            Products
                        </span>

                        <strong className="admin-stat-value">
                            {products.length}
                        </strong>
                    </div>


                    <div className="admin-stat">
                        <span className="admin-stat-label">
                            Orders
                        </span>

                        <strong className="admin-stat-value">
                            {orders.length}
                        </strong>
                    </div>


                    <div className="admin-stat">
                        <span className="admin-stat-label">
                            Pending
                        </span>

                        <strong className="admin-stat-value">
                            {
                                orders.filter(
                                    (order) =>
                                        (
                                            order.status ||
                                            "Pending"
                                        ).toLowerCase() ===
                                        "pending"
                                ).length
                            }
                        </strong>
                    </div>

                </section>


                {/* =================================================
                    ADD PRODUCT
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <h2>
                            Add Product
                        </h2>

                        <span>
                            New Saree
                        </span>

                    </div>


                    <form
                        className="admin-product-form"
                        onSubmit={addProduct}
                    >

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Product name"
                            required
                        />


                        <input
                            name="price"
                            type="number"
                            min="0"
                            step="1"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price (₹)"
                            required
                        />


                        <input
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Category"
                            required
                        />


                        <input
                            name="stock"
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={handleChange}
                            placeholder="Stock quantity"
                            required
                        />


                        <input
                            className="full-width"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="Image URL"
                        />


                        <textarea
                            className="full-width"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Product description"
                            rows="4"
                        />


                        <div className="full-width">

                            <button
                                type="submit"
                                className="admin-button"
                            >
                                Add Product
                            </button>

                        </div>

                    </form>

                </section>


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <section
                    id="products"
                    className="admin-section"
                >

                    <div className="admin-section-header">

                        <h2>
                            Products
                        </h2>

                        <span>
                            {products.length}{" "}
                            {products.length === 1
                                ? "product"
                                : "products"}
                        </span>

                    </div>


                    <div className="admin-products">

                        {products.length === 0 ? (

                            <div className="admin-empty">

                                <p>
                                    No products added yet.
                                </p>

                            </div>

                        ) : (

                            products.map((product) => (

                                <article
                                    className="admin-product"
                                    key={product.id}
                                >

                                    {product.image ? (

                                        <img
                                            className="admin-product-image"
                                            src={product.image}
                                            alt={product.name}
                                            onError={(
                                                event
                                            ) => {
                                                event.currentTarget.style.visibility =
                                                    "hidden";
                                            }}
                                        />

                                    ) : (

                                        <div className="admin-product-image" />

                                    )}


                                    <div className="admin-product-info">

                                        <h3>
                                            {product.name}
                                        </h3>

                                        <p>
                                            {product.category ||
                                                "Sarees"}
                                        </p>

                                        <p>
                                            Stock:{" "}
                                            {product.stock}
                                        </p>

                                        <p className="admin-product-price">
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                    </div>


                                    <div className="admin-product-actions">

                                        <button
                                            type="button"
                                            className="admin-delete"
                                            onClick={() =>
                                                deleteProduct(
                                                    product.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </article>

                            ))

                        )}

                    </div>

                </section>


                {/* =================================================
                    ORDERS
                ================================================= */}

                <section
                    id="orders"
                    className="admin-section"
                >

                    <div className="admin-section-header">

                        <h2>
                            Customer Orders
                        </h2>

                        <span>
                            {orders.length}{" "}
                            {orders.length === 1
                                ? "order"
                                : "orders"}
                        </span>

                    </div>


                    <div className="admin-orders">

                        {orders.length === 0 ? (

                            <div className="admin-empty">

                                <p>
                                    No orders yet.
                                </p>

                            </div>

                        ) : (

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Order
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Total
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {orders.map(
                                        (order) => (

                                            <tr
                                                key={
                                                    order.id
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        #
                                                        {
                                                            order.id
                                                        }
                                                    </strong>
                                                </td>


                                                <td>
                                                    {
                                                        order.customer_name ||
                                                        "Customer"
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        order.phone ||
                                                        "—"
                                                    }
                                                </td>


                                                <td>
                                                    ₹
                                                    {Number(
                                                        order.total ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>


                                                <td>

                                                    <select
                                                        className="status-select"
                                                        value={
                                                            order.status ||
                                                            "Pending"
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateOrderStatus(
                                                                order.id,
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    >

                                                        <option value="Pending">
                                                            Pending
                                                        </option>

                                                        <option value="Confirmed">
                                                            Confirmed
                                                        </option>

                                                        <option value="Processing">
                                                            Processing
                                                        </option>

                                                        <option value="Shipped">
                                                            Shipped
                                                        </option>

                                                        <option value="Delivered">
                                                            Delivered
                                                        </option>

                                                        <option value="Cancelled">
                                                            Cancelled
                                                        </option>

                                                    </select>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}

export default AdminDashboard;