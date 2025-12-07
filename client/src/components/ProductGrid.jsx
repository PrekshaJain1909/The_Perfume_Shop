import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products = [] }) => {
  return (
    <section className="collection-root" id="collection-section">
      <div className="collection-inner">
        <div className="collection-header">
          <h2>Featured Fragrances</h2>
          <p>
            Explore our signature lineup — bold, timeless and unforgettable.
            Every perfume is crafted to elevate your presence and leave a lasting impression.
          </p>
        </div>

        <div className="collection-grid">
          {products.map((p) => (
           <ProductCard
  key={p._id || p.id}
  _id={p._id || p.id}
  name={p.name}       
  description={p.fullDescription || p.description} // 👈 send full description
  price={p.price}
  image={p.images?.[0]}
  exclusive={p.exclusive}
  trending={p.trending}
/>

          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
