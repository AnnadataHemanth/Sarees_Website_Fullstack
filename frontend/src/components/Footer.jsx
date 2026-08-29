import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-brand">
                    <h2>Saavithri</h2>
                    <span>HANDLOOMS</span>

                    <p>
                        Discover timeless Indian handlooms,
                        carefully selected for elegance,
                        tradition and everyday beauty.
                    </p>
                </div>

                <div className="footer-column">
                    <h3>Explore</h3>

                    <Link to="/">Home</Link>
                    <Link to="/products">Sarees</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/orders">My Orders</Link>
                </div>

                <div className="footer-column">
                    <h3>Account</h3>

                    <Link to="/login">Sign In</Link>
                    <Link to="/register">Create Account</Link>
                </div>

                <div className="footer-column">
                    <h3>Visit Us</h3>

                    <p>Hyderabad</p>
                    <p>Telangana, India</p>
                    <p>Authentic Indian Handlooms</p>
                </div>

            </div>

            <div className="footer-bottom">
                <span>
                    © {new Date().getFullYear()} Saavithri Handlooms
                </span>

                <span>
                    Hyderabad • India
                </span>
            </div>

        </footer>
    );
}

export default Footer;