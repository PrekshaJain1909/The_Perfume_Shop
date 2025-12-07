import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import { fetchProducts } from "../api/productApi";
import "./CollectionPage.css";
import Footer from "../components/Footer";
const CollectionsPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("featured"); // featured | price-asc | price-desc
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProducts();
        const list = Array.isArray(data) ? data : data?.products || [];
        setProducts(list);
        // apply filter from query param if present
        const tag = searchParams.get("tag") || searchParams.get("filter") || null;
        if (tag === "exclusive") {
          setVisibleProducts(list.filter((p) => p.exclusive));
        } else {
          setVisibleProducts(list);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load collections right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);

    if (!products.length) return;

    let sorted = [...products];

    if (value === "price-asc") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (value === "price-desc") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      sorted = [...products]; // featured = original order
    }

    // apply the same tag filter when sorting
    const tag = searchParams.get("tag") || searchParams.get("filter") || null;
    if (tag === "exclusive") {
      setVisibleProducts(sorted.filter((p) => p.exclusive));
    } else {
      setVisibleProducts(sorted);
    }
  };

  return (
    <>
      <Navbar />
      <main className="collections-main">
        <header className="collections-header">
          <div>
            <h1>Our Collections</h1>
            <p>
              Discover handpicked fragrances from our curated perfume
              collection. Find a scent that matches your mood and style.
            </p>
          </div>

          <div className="collections-controls">
            <label>
              Sort by:
              <select value={sort} onChange={handleSortChange}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>
        </header>

        {loading ? (
          <section className="collections-status">
            <p>Loading perfumes…</p>
          </section>
        ) : error ? (
          <section className="collections-status">
            <p>{error}</p>
          </section>
        ) : visibleProducts.length === 0 ? (
          <section className="collections-status">
            <p>No perfumes found.</p>
          </section>
        ) : (
          <ProductGrid products={visibleProducts} />
        )}
      </main>
      <Footer />
    </>
  );
};

export default CollectionsPage;
