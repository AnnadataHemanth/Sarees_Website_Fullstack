import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function Checkout() {
    const navigate = useNavigate();

    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, token } = useAuth();

    const [form, setForm] = useState({
        name: user?.name || "",
        phone: "",
        address: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!token) {
            navigate("/login");
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        if (!form.name.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!form.phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!form.address.trim()) {
            setError("Please enter your delivery address.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/orders`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        customer_name: form.name.trim(),
                        phone: form.phone.trim(),
                        address: form.address.trim(),

                        items: cartItems.map((item) => ({
                            product_id: Number(item.id),
                            quantity: Number(item.quantity || 1),
                        })),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to place order"
                );
            }

            clearCart();

            navigate("/orders");

        } catch (err) {
            console.error("CHECKOUT ERROR:", err);

            setError(
                err.message ||
                "Something went wrong while placing your order."
            );
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <main className="page-center">

                <h1>
                    Your cart is empty
                </h1>

                <Link
                    to="/products"
                    className="primary-button"
                >
                    Browse Sarees
                </Link>

            </main>
        );
    }

    return (
        <main className="checkout-page">

            <div className="page-header">

                <p className="section-eyebrow">
                    COMPLETE YOUR ORDER
                </p>

                <h1>
                    Checkout
                </h1>

                <p>
                    Enter your delivery details below.
                </p>

            </div>


            <section className="checkout-container">

                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        Delivery Details
                    </h2>


                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}


                    <label>
                        Full Name
                    </label>

                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                    />


                    <label>
                        Phone Number
                    </label>

                    <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        required
                    />


                    <label>
                        Delivery Address
                    </label>

                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="House number, street, area, city, state, pincode"
                        rows="6"
                        required
                    />


                    <button
                        type="submit"
                        className="checkout-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Placing Order..."
                            : "Place Order"}
                    </button>

                </form>


                <aside className="checkout-summary">

                    <p className="summary-eyebrow">
                        YOUR ORDER
                    </p>

                    <h2>
                        Order Summary
                    </h2>


                    {cartItems.map((item) => (

                        <div
                            className="checkout-item"
                            key={item.id}
                        >

                            <div>

                                <strong>
                                    {item.name}
                                </strong>

                                <span>
                                    Qty:{" "}
                                    {item.quantity || 1}
                                </span>

                            </div>

                            <strong>
                                ₹
                                {(
                                    Number(item.price) *
                                    Number(item.quantity || 1)
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>

                    ))}


                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹
                            {Number(
                                cartTotal
                            ).toLocaleString("en-IN")}
                        </strong>

                    </div>

                </aside>

            </section>

        </main>
    );
}

export default Checkout;