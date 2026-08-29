import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <article className="product-card">

            <Link
                to={`/products/${product.id}`}
                className="product-image-wrapper"
            >
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                    />
                ) : (
                    <div className="product-placeholder">
                        Saavithri Handlooms
                    </div>
                )}

                {product.stock === 0 && (
                    <span className="sold-out">
                        Sold Out
                    </span>
                )}
            </Link>

            <div className="product-info">

                <span className="product-category">
                    {product.category || "Sarees"}
                </span>

                <Link to={`/products/${product.id}`}>
                    <h3>{product.name}</h3>
                </Link>

                <div className="product-bottom">

                    <span className="product-price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>

                    <button
                        className="add-cart-button"
                        disabled={!product.stock}
                        onClick={() => addToCart(product)}
                    >
                        {product.stock ? "Add to Cart" : "Unavailable"}
                    </button>

                </div>

            </div>

        </article>
    );
}

export default ProductCard;