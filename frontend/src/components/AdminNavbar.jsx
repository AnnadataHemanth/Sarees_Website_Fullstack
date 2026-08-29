import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminNavbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const goToSection = (section) => {
        navigate(`/admin#${section}`);

        setTimeout(() => {
            document.getElementById(section)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 50);
    };

    return (
        <header className="admin-navbar">
            <div className="admin-navbar-container">

                <Link
                    to="/admin"
                    className="admin-brand"
                >
                    <span className="admin-brand-main">
                        Saavithri
                    </span>

                    <span className="admin-brand-sub">
                        ADMIN
                    </span>
                </Link>


                <nav className="admin-nav-links">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <button
                        type="button"
                        onClick={() =>
                            goToSection("products")
                        }
                    >
                        Products
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            goToSection("orders")
                        }
                    >
                        Orders
                    </button>

                </nav>


                <div className="admin-nav-right">

                    <span className="admin-user">
                        Hi, {user?.name}
                    </span>

                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>
        </header>
    );
}

export default AdminNavbar;