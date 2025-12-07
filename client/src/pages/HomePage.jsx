import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import ProductGrid from "../components/ProductGrid";
import { fetchProducts } from "../api/productApi";
import Footer from "../components/Footer";
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : data?.products || []);
      } catch (err) {
        setError("Unable to load perfumes right now.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <>
      <Navbar />
      <HeroBanner />
      {loading ? (
        <section style={{ padding: "40px 8%", textAlign: "center" }}>
          Loading perfumes…
        </section>
      ) : error ? (
        <section style={{ padding: "40px 8%", textAlign: "center" }}>
          {error}
        </section>
      ) : (
        <ProductGrid products={products} />
      )}
      <Footer />
    </>
  );
};

export default HomePage;
