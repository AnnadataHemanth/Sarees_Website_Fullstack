import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    const cartCount = cartItems.reduce(
        (total, item) => total + (item.quantity || 1),
        0
    );

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="navbar">
            <div className="navbar-container">

                <Link to="/" className="brand">
                    <span className="brand-main">
                        Saavithri
                    </span>

                    <span className="brand-sub">
                        HANDLOOMS
                    </span>
                </Link>


                <nav className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/products">
                        Sarees
                    </Link>

                    {user && (
                        <Link to="/orders">
                            My Orders
                        </Link>
                    )}

                </nav>


                <div className="nav-actions">

                    <Link
                        to="/cart"
                        className="cart-link"
                    >
                        Cart

                        {cartCount > 0 && (
                            <span className="cart-count">
                                {cartCount}
                            </span>
                        )}
                    </Link>


                    {user ? (
                        <div className="user-menu">

                            <span className="user-name">
                                Hi, {user.name}
                            </span>

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="nav-login"
                        >
                            Sign In
                        </Link>
                    )}

                </div>

            </div>
        </header>
    );
}

export default Navbar;