import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function MyOrders() {
    const { user, token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                setError("Please sign in to view your orders.");
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/orders/my-orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load orders"
                    );
                }

                setOrders(
                    Array.isArray(data)
                        ? data
                        : data.orders || []
                );
            } catch (err) {
                console.error("MY ORDERS ERROR:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    if (!user) {
        return (
            <main className="page-center">
                <p className="section-eyebrow">
                    SAAVITHRI HANDLOOMS
                </p>

                <h1>
                    Sign in to view your orders
                </h1>

                <Link
                    to="/login"
                    className="primary-button"
                >
                    Sign In
                </Link>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="page-center">
                <p>Loading your orders...</p>
            </main>
        );
    }

    return (
        <main className="orders-page">

            <div className="page-header">
                <p className="section-eyebrow">
                    SAAVITHRI HANDLOOMS
                </p>

                <h1>
                    My Orders
                </h1>

                <p>
                    View your purchases and track their status.
                </p>
            </div>


            <section className="orders-container">

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}


                {!error && orders.length === 0 ? (

                    <div className="empty">

                        <p className="section-eyebrow">
                            YOUR PURCHASES
                        </p>

                        <h2>
                            No orders yet
                        </h2>

                        <p>
                            Your completed orders will appear here.
                        </p>

                        <Link
                            to="/products"
                            className="primary-button"
                        >
                            Explore Sarees
                        </Link>

                    </div>

                ) : (

                    <div className="orders-list">

                        {orders.map((order) => (

                            <article
                                className="order-card"
                                key={order.id}
                            >

                                {/* HEADER */}

                                <div className="order-header">

                                    <div>

                                        <span>
                                            ORDER #{order.id}
                                        </span>

                                        <h2>
                                            ₹
                                            {Number(
                                                order.total || 0
                                            ).toLocaleString("en-IN")}
                                        </h2>

                                    </div>


                                    <span className="order-status">
                                        {order.status || "Pending"}
                                    </span>

                                </div>


                                {/* CUSTOMER DETAILS */}

                                <div className="order-details">

                                    <p>
                                        <strong>
                                            Name:
                                        </strong>{" "}
                                        {order.customer_name || "—"}
                                    </p>

                                    <p>
                                        <strong>
                                            Phone:
                                        </strong>{" "}
                                        {order.phone || "—"}
                                    </p>

                                    <p>
                                        <strong>
                                            Address:
                                        </strong>{" "}
                                        {order.address || "—"}
                                    </p>

                                    <p>
                                        <strong>
                                            Ordered:
                                        </strong>{" "}
                                        {order.created_at
                                            ? new Date(
                                                  order.created_at
                                              ).toLocaleString(
                                                  "en-IN"
                                              )
                                            : "—"}
                                    </p>

                                </div>


                                {/* ITEMS */}

                                {Array.isArray(order.items) &&
                                    order.items.length > 0 && (

                                        <div className="order-items">

                                            <h4>
                                                Items
                                            </h4>

                                            {order.items.map(
                                                (item, index) => (

                                                    <div
                                                        className="order-item"
                                                        key={
                                                            item.id ||
                                                            index
                                                        }
                                                    >

                                                        <span>
                                                            {item.product_name}
                                                        </span>

                                                        <span>
                                                            ×
                                                            {" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>

                                                        <strong>
                                                            ₹
                                                            {Number(
                                                                item.price
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>

                                                    </div>

                                                )
                                            )}

                                        </div>
                                    )}

                            </article>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default MyOrders;