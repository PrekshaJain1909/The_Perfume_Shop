import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-root">
      <div className="hero-inner">
        <h1 className="hero-title">Where Luxury Meets Fragrance</h1>
        <p className="hero-subtitle">
          Indulge in hand-crafted perfumes inspired by passion, emotions and
          timeless elegance. Because your scent deserves to be remembered.
        </p>

        <div className="hero-actions">
          <button
            className="hero-btn hero-btn-primary"
            onClick={() => navigate("/collections?tag=exclusive")}
          >
            Shop Exclusives
          </button>
          <button
            className="hero-btn hero-btn-primary"
            onClick={() => navigate("/collections")}
          >
            Explore Collections
          </button>
        </div>

        <div className="hero-pill">
          🌙 Bestseller Drop: Free Luxe Gift on orders above ₹3499
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
