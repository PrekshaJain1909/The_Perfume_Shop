import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useWishlist } from "../context/WishlistContext";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

const ProductCard = ({ _id, name, shortDescription, description, price, image, exclusive, trending }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (_id) navigate(`/product/${_id}`);
  };

  const { items: wishItems, toggle, remove } = useWishlist();
  const { user } = useAuth();
  const isWished = wishItems.includes(String(_id));

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    const willAdd = !isWished;
    try {
      await toggle(_id);
      if (willAdd) {
        Swal.fire({ icon: "success", title: "Added to wishlist", timer: 1200, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "success", title: "Removed from wishlist", timer: 900, showConfirmButton: false });
      }
    } catch (err) {
      console.error("Wishlist toggle failed", err);
      Swal.fire({ icon: "error", title: "Unable to update wishlist" });
    }
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card-image-wrapper">
        
        {/* 🔥 Badges */}
        {(exclusive || trending) && (
          <div className="product-card-badges">
            {exclusive && <span className="badge badge-exclusive">Exclusive</span>}
            {trending && <span className="badge badge-trending">Trending</span>}
          </div>
        )}

        <img
          src={image}
          alt={name}
          className="product-card-image"
          loading="lazy"
        />

        <div className="product-card-overlay">
          <button
            className={`product-card-wishlist-btn ${isWished ? "active" : ""}`}
            onClick={handleToggleWishlist}
            title={isWished ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWished ? "♥" : "♡"}
          </button>
          <button
            className="product-card-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            View Product
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{name}</h3>

        {/* optional: full description preview */}
        {description && (
          <p className="product-card-desc2">
            {description.length > 80 ? description.slice(0, 80) + "..." : description}
          </p>
        )}

        <div className="product-card-footer">
          <span className="product-card-price">₹{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
