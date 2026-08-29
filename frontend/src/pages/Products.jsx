import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:5000/api";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/products/categories`)
            .then((res) => res.json())
            .then((data) => {
                setCategories(Array.isArray(data) ? data : []);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);

        const params = new URLSearchParams();

        if (search.trim()) {
            params.append("search", search);
        }

        if (category) {
            params.append("category", category);
        }

        const url = `${API_URL}/products?${params.toString()}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Failed to load products:", error);
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [search, category]);

    return (
        <main className="products-page">

            <section className="page-header">

                <p className="section-eyebrow">
                    SAAVITHRI HANDLOOMS
                </p>

                <h1>
                    The Collection
                </h1>

                <p>
                    Explore our selection of handpicked sarees.
                </p>

            </section>


            <section className="catalog-section">

                <div className="catalog-toolbar">

                    <input
                        type="text"
                        placeholder="Search sarees..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="search-input"
                    />

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        className="category-select"
                    >
                        <option value="">
                            All Categories
                        </option>

                        {categories.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        ))}
                    </select>

                </div>


                {loading ? (
                    <div className="loading">
                        Loading collection...
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty">
                        <h2>
                            No sarees found
                        </h2>

                        <p>
                            Try another search or category.
                        </p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}

            </section>

        </main>
    );
}

export default Products;