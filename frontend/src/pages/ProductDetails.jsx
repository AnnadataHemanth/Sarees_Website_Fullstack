import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000/api";

function ProductDetails() {
    const { id } = useParams();

    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/products/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Product not found");
                }

                return res.json();
            })
            .then((data) => {
                setProduct(data);
            })
            .catch((error) => {
                console.error(error);
                setProduct(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <main className="page-center">
                <p>Loading product...</p>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="page-center">

                <h1>
                    Product Not Found
                </h1>

                <Link
                    to="/products"
                    className="primary-button"
                >
                    Back to Collection
                </Link>

            </main>
        );
    }

    return (
        <main className="product-detail-page">

            <div className="product-detail">

                <div className="detail-image">

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                        />
                    ) : (
                        <div className="product-placeholder">
                            Saavithri Handlooms
                        </div>
                    )}

                </div>


                <div className="detail-content">

                    <Link
                        to="/products"
                        className="back-link"
                    >
                        ← Back to Collection
                    </Link>

                    <span className="product-category">
                        {product.category || "Sarees"}
                    </span>

                    <h1>
                        {product.name}
                    </h1>

                    <div className="detail-price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                    </div>

                    <div className="detail-divider" />

                    <p className="detail-description">
                        {product.description ||
                            "A beautiful saree selected from our handloom collection."}
                    </p>

                    <div className="stock-info">

                        {product.stock > 0 ? (
                            <>
                                <span className="stock-dot" />
                                {product.stock} available
                            </>
                        ) : (
                            "Currently unavailable"
                        )}

                    </div>

                    <button
                        className="detail-add-button"
                        disabled={!product.stock}
                        onClick={() => addToCart(product)}
                    >
                        {product.stock
                            ? "Add to Cart"
                            : "Sold Out"}
                    </button>

                </div>

            </div>

        </main>
    );
}

export default ProductDetails;