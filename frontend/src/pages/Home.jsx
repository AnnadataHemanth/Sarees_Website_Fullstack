import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:5000/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Failed to load products:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const featuredProducts = products.slice(0, 4);

    return (
        <main>

            {/* HERO */}

            <section className="hero">

                <div className="hero-content">

                    <p className="hero-eyebrow">
                        AUTHENTIC INDIAN HANDLOOMS
                    </p>

                    <h1>
                        Woven with
                        <br />
                        <em>Tradition.</em>
                    </h1>

                    <p className="hero-description">
                        Discover beautiful sarees that bring
                        together timeless craftsmanship,
                        heritage and contemporary elegance.
                    </p>

                    <Link
                        to="/products"
                        className="hero-button"
                    >
                        Explore Collection
                    </Link>

                </div>

                <div className="hero-decoration">
                    <span>SAAVITHRI</span>
                </div>

            </section>


            {/* INTRO */}

            <section className="intro-section">

                <p className="section-eyebrow">
                    OUR COLLECTION
                </p>

                <h2>
                    Sarees with a story
                </h2>

                <p>
                    From traditional weaves to elegant
                    contemporary designs, every saree
                    is chosen with an appreciation for
                    Indian craftsmanship.
                </p>

            </section>


            {/* FEATURED PRODUCTS */}

            <section className="featured-section">

                <div className="section-header">

                    <div>
                        <p className="section-eyebrow">
                            HANDPICKED FOR YOU
                        </p>

                        <h2>
                            Featured Sarees
                        </h2>
                    </div>

                    <Link
                        to="/products"
                        className="view-all"
                    >
                        View All →
                    </Link>

                </div>

                {loading ? (
                    <div className="loading">
                        Loading collection...
                    </div>
                ) : featuredProducts.length === 0 ? (
                    <div className="empty">
                        <h2>
                            Collection coming soon
                        </h2>

                        <p>
                            Our saree collection is being
                            prepared for you.
                        </p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}

            </section>


            {/* BRAND SECTION */}

            <section className="heritage-section">

                <div className="heritage-content">

                    <p className="section-eyebrow">
                        THE SAAVITHRI STORY
                    </p>

                    <h2>
                        Tradition that
                        <br />
                        <em>lives on.</em>
                    </h2>

                    <p>
                        Handloom is more than fabric.
                        It is the work of skilled hands,
                        generations of knowledge and
                        India's rich textile heritage.
                    </p>

                    <Link
                        to="/products"
                        className="text-link"
                    >
                        Discover our sarees →
                    </Link>

                </div>

            </section>


            {/* BENEFITS */}

            <section className="benefits-section">

                <div className="benefit">
                    <span>01</span>
                    <h3>Authentic Handlooms</h3>
                    <p>
                        Carefully selected traditional
                        and handloom sarees.
                    </p>
                </div>

                <div className="benefit">
                    <span>02</span>
                    <h3>Quality First</h3>
                    <p>
                        Every piece is selected with
                        quality and craftsmanship in mind.
                    </p>
                </div>

                <div className="benefit">
                    <span>03</span>
                    <h3>Delivered to You</h3>
                    <p>
                        Order online and have your
                        sarees delivered to your doorstep.
                    </p>
                </div>

            </section>

        </main>
    );
}

export default Home;