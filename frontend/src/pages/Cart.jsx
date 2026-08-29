import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
    const navigate = useNavigate();

    const {
        cartItems,
        removeFromCart,
        clearCart,
        updateQuantity,
    } = useCart();

    const { user } = useAuth();

    const total = cartItems.reduce(
        (sum, item) =>
            sum +
            Number(item.price) *
                (item.quantity || 1),
        0
    );

    const itemCount = cartItems.reduce(
        (sum, item) =>
            sum + (item.quantity || 1),
        0
    );

    const handleCheckout = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        navigate("/checkout");
    };

    // =====================================================
    // EMPTY CART
    // =====================================================

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">

                <section className="empty-cart">

                    <div className="empty-cart-icon">
                        ♡
                    </div>

                    <p className="section-eyebrow">
                        YOUR SHOPPING BAG
                    </p>

                    <h1>
                        Your cart is empty
                    </h1>

                    <p>
                        Discover a beautiful saree from
                        our collection.
                    </p>

                    <Link
                        to="/products"
                        className="primary-button"
                    >
                        Explore Sarees
                    </Link>

                </section>

            </main>
        );
    }

    return (
        <main className="cart-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="cart-header">

                <p className="section-eyebrow">
                    YOUR SHOPPING BAG
                </p>

                <h1>
                    Your Cart
                </h1>

                <p>
                    {itemCount}{" "}
                    {itemCount === 1
                        ? "item"
                        : "items"}{" "}
                    selected
                </p>

            </header>


            {/* =================================================
                CART
            ================================================= */}

            <section className="cart-layout">

                {/* =================================================
                    ITEMS
                ================================================= */}

                <div className="cart-items">

                    {cartItems.map((item) => {

                        const quantity =
                            item.quantity || 1;

                        const itemTotal =
                            Number(item.price) *
                            quantity;

                        return (
                            <article
                                className="cart-item"
                                key={item.id}
                            >

                                {/* IMAGE */}

                                <Link
                                    to={`/products/${item.id}`}
                                    className="cart-item-image-wrapper"
                                >

                                    {item.image ? (

                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="cart-item-image"
                                        />

                                    ) : (

                                        <div className="cart-item-placeholder">
                                            Saavithri
                                        </div>

                                    )}

                                </Link>


                                {/* INFORMATION */}

                                <div className="cart-item-info">

                                    <span className="cart-item-category">
                                        {item.category ||
                                            "Handloom Sarees"}
                                    </span>

                                    <Link
                                        to={`/products/${item.id}`}
                                    >
                                        <h2>
                                            {item.name}
                                        </h2>
                                    </Link>

                                    <p className="cart-item-price">
                                        ₹
                                        {Number(
                                            item.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>


                                    {/* QUANTITY */}

                                    <div className="quantity-controls">

                                        <button
                                            type="button"
                                            aria-label="Decrease quantity"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    Math.max(
                                                        1,
                                                        quantity - 1
                                                    )
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            aria-label="Increase quantity"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    Math.min(
                                                        Number(
                                                            item.stock
                                                        ),
                                                        quantity + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                quantity >=
                                                Number(
                                                    item.stock
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>


                                {/* RIGHT SIDE */}

                                <div className="cart-item-actions">

                                    <strong className="cart-item-total">
                                        ₹
                                        {itemTotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() =>
                                            removeFromCart(
                                                item.id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </article>
                        );
                    })}

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <aside className="cart-summary">

                    <p className="summary-eyebrow">
                        ORDER SUMMARY
                    </p>

                    <h2>
                        Your Order
                    </h2>


                    <div className="cart-summary-row">

                        <span>
                            Items
                        </span>

                        <span>
                            {itemCount}
                        </span>

                    </div>


                    <div className="cart-summary-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹
                            {total.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>


                    <div className="cart-summary-row">

                        <span>
                            Delivery
                        </span>

                        <span className="muted">
                            At checkout
                        </span>

                    </div>


                    <div className="cart-summary-row total">

                        <span>
                            Total
                        </span>

                        <span>
                            ₹
                            {total.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>


                    <button
                        type="button"
                        className="checkout-button"
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </button>


                    <Link
                        to="/products"
                        className="continue-shopping"
                    >
                        ← Continue Shopping
                    </Link>


                    <button
                        type="button"
                        className="clear-cart"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Clear all items from your cart?"
                                )
                            ) {
                                clearCart();
                            }
                        }}
                    >
                        Clear Cart
                    </button>

                </aside>

            </section>

        </main>
    );
}

export default Cart;