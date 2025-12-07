import Navbar from "../components/Navbar";
import "./AboutPage.css";
import Footer from "../components/Footer";
const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main className="about-container">
        {/* Hero */}
        <section className="about-hero">
          <h1 className="about-title">The Perfume Club</h1>
          <p className="about-subtitle">
            A curated destination for fragrance lovers — discover scents that
            feel personal, modern, and unforgettable.
          </p>
        </section>

        {/* Our Story */}
        <section className="about-section">
          <h2 className="about-heading">Our Story</h2>
          <p className="about-text">
            The Perfume Club began with a simple belief: choosing a fragrance
            should feel exciting, not confusing. We wanted to create a space
            where everyone — from beginners to collectors — can explore
            thoughtfully selected perfumes without the noise and overwhelm.
            Every scent in our collection is handpicked for its character,
            quality, and the emotion it leaves behind.
          </p>
        </section>

        {/* Our Philosophy */}
        <section className="about-section">
          <h2 className="about-heading">Our Philosophy</h2>
          <p className="about-text">
            We see fragrance as a quiet form of self-expression. It doesn’t
            shout; it lingers. That’s why we focus on blends that feel wearable
            yet distinctive — perfumes that move with you from day to night.
            The Perfume Club is built around transparency, experience, and
            trust, so you can discover your signature scent with confidence.
          </p>
        </section>

        {/* What We Offer / Promise */}
        <section className="about-section">
          <h2 className="about-heading">What You’ll Find Here</h2>
          <ul className="about-list">
            <li>Curated collections of timeless and trending fragrances</li>
            <li>Detailed notes, stories, and usage tips for every perfume</li>
            <li>Scents for every mood — soft, bold, fresh, and sensual</li>
            <li>A growing community of fragrance lovers and honest reviews</li>
          </ul>
        </section>

        {/* Banner */}
        <section className="about-section about-banner">
          <p className="about-banner-text">
            ✨ At The Perfume Club, every bottle is an invitation to discover
            a new side of you.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
