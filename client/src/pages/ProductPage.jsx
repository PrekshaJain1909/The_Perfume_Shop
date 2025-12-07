import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useWishlist } from "../context/WishlistContext";

import Navbar from "../components/Navbar";
import ImageGallery from "../components/ImageGallery";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import {
  fetchProductById,
  fetchReviews,
  createReview,
} from "../api/productApi";

import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState("");

  // load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        setError("");
        const data = await fetchProductById(id);
        setProduct(data);
        if (data?.sizes?.length) setSelectedSize(data.sizes[0]);
      } catch (err) {
        console.error(err);
        setError("Unable to load product details. Please try again later.");
      } finally {
        setLoadingProduct(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  // load reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoadingReviews(true);
        const data = await fetchReviews(id);
        setReviews(Array.isArray(data) ? data : data?.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReviews(false);
      }
    };
    if (id) loadReviews();
  }, [id]);
const { addToCart } = useCart();
  const { items: wishItems, toggle: toggleWishlist, remove: removeFromWishlist } = useWishlist();
  const ratingSummary = useMemo(() => {
    if (!reviews.length) return { avg: null, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return { avg: sum / reviews.length, count: reviews.length };
  }, [reviews]);

  const handleQtyChange = (delta) => {
    setQty((prev) => {
      const next = prev + delta;
      return next < 1 ? 1 : next;
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: product?.name || "Perfume",
          text: "Check out this fragrance I found.",
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() =>
          Swal.fire({
            icon: "success",
            title: "Link copied",
            text: "Product link copied to clipboard",
            timer: 1600,
            showConfirmButton: false,
          })
        )
        .catch(() =>
          Swal.fire({
            icon: "error",
            title: "Unable to copy",
            text: "Please copy the link manually.",
          })
        );
    }
  };
  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      Swal.fire({
        icon: "warning",
        title: "Select size",
        text: "Please select a size before adding to cart.",
      });
      return;
    }

    addToCart(product, { size: selectedSize, qty });
    Swal.fire({
      icon: "success",
      title: "Added to cart",
      text: "Product added to your cart.",
      timer: 1400,
      showConfirmButton: false,
    });
  };

  const handleAddReview = async (formData) => {
    setIsSubmittingReview(true);
    try {
      const newReview = await createReview(id, formData);

      console.log("Review submitted successfully:", newReview);

      if (newReview) {
        setReviews((prev) => [newReview, ...prev]);
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to submit",
        text: err.message || "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loadingProduct) {
    return (
      <>
        <Navbar />
        <main className="pp-main pp-main--center">
          <p>Loading product…</p>
        </main>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main className="pp-main pp-main--center">
          <p style={{ color: "#b03a2e" }}>{error || "Product not found."}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pp-main">
        {/* main product layout */}
        <section className="pp-top-section">
          {/* left: main image + thumbnails */}
          <div className="pp-media">
            <ImageGallery images={product.images || []} />
          </div>

          {/* right: details */}
          <div className="pp-details">
            <h1 className="pp-title">{product.name}</h1>

            {/* rating row */}
            <div className="pp-rating-row">
              {ratingSummary.avg ? (
                <>
                  <span className="pp-stars">★★★★★</span>
                  <span className="pp-rating-number">
                    {ratingSummary.avg.toFixed(1)}
                  </span>
                  <span className="pp-rating-count">
                    ({ratingSummary.count} reviews)
                  </span>
                </>
              ) : (
                <span className="pp-rating-count">No reviews yet</span>
              )}
            </div>

            {/* price + stock + sku */}
            <div className="pp-price-row">
              <span className="pp-price">${product.price}</span>
              <span className="pp-stock">In Stock</span>
              <span className="pp-sku">SKU: DEMO-2025-001</span>
            </div>

            {/* main description */}
            <p className="pp-description">{product.fullDescription}</p>

            {/* OPTIONAL: fragrance notes box */}
            {product.fragranceNotes && (
              <div className="pp-notes-box">
                <h4>Fragrance Notes</h4>
                <div className="pp-notes-grid">
                  <div>
                    <p className="pp-notes-label">Top Notes</p>
                    <p className="pp-notes-value">
                      {product.fragranceNotes.top}
                    </p>
                  </div>
                  <div>
                    <p className="pp-notes-label">Heart Notes</p>
                    <p className="pp-notes-value">
                      {product.fragranceNotes.heart}
                    </p>
                  </div>
                  <div>
                    <p className="pp-notes-label">Base Notes</p>
                    <p className="pp-notes-value">
                      {product.fragranceNotes.base}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* sizes */}
            {product.sizes?.length > 0 && (
              <div className="pp-size-block">
                <p className="pp-label">Select Size</p>
                <div className="pp-size-row">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`pp-size-btn ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* quantity + actions row */}
            <div className="pp-actions-row">
              <div className="pp-qty-wrapper">
                <button
                  type="button"
                  className="pp-qty-btn"
                  onClick={() => handleQtyChange(-1)}
                >
                  −
                </button>
                <span className="pp-qty-value">{qty}</span>
                <button
                  type="button"
                  className="pp-qty-btn"
                  onClick={() => handleQtyChange(1)}
                >
                  +
                </button>
              </div>

              <button
  type="button"
  className="pp-btn-primary"
  onClick={handleAddToCart}
>
  Add to Cart
</button>


              <button
                type="button"
                className={`pp-heart-btn ${
                  product && wishItems.includes(String(product._id || product.id))
                    ? "active"
                    : ""
                }`}
                onClick={async (e) => {
                  e.stopPropagation?.();
                  if (!product) return;
                  const pid = String(product._id || product.id || product.productId || "");
                  const willAdd = !wishItems.includes(pid);
                  try {
                      await toggleWishlist(pid);
                      if (willAdd) {
                        try {
                        await moveToCart(product);
                      } catch (e) {
                        console.error("Failed to move wishlist item to cart", e);
                      }
                      }
                    if (willAdd) {
                      Swal.fire({ icon: "success", title: "Added to wishlist", timer: 1200, showConfirmButton: false });
                    } else {
                      Swal.fire({ icon: "success", title: "Removed from wishlist", timer: 1200, showConfirmButton: false });
                    }
                  } catch (err) {
                    console.error("Wishlist toggle failed", err);
                    Swal.fire({ icon: "error", title: "Unable to update wishlist" });
                  }
                }}
              >
                {product && wishItems.includes(String(product._id || product.id)) ? "♥" : "♡"}
              </button>
            </div>

            <button
              type="button"
              className="pp-btn-secondary"
              onClick={handleShare}
            >
              Share Product
            </button>
          </div>
        </section>

        {/* customer reviews section */}
        <section className="pp-reviews">
          <h2 className="pp-reviews-heading">Customer Reviews</h2>

          <div className="pp-reviews-summary-row">
            <div className="pp-reviews-score-block">
              {ratingSummary.avg ? (
                <>
                  <div className="pp-reviews-score">
                    {ratingSummary.avg.toFixed(1)}
                  </div>
                  <div className="pp-reviews-stars">★★★★★</div>
                  <div className="pp-reviews-count">
                    {ratingSummary.count} verified reviews
                  </div>
                </>
              ) : (
                <div className="pp-reviews-count">No reviews yet</div>
              )}
            </div>

            <button
              type="button"
              className="pp-write-btn"
              onClick={() => setShowReviewForm((v) => !v)}
            >
              ✎ Write a Review
            </button>
          </div>

          {showReviewForm && (
            <div className="pp-review-form-wrapper">
              <ReviewForm
                onSubmit={handleAddReview}
                isSubmitting={isSubmittingReview}
              />
            </div>
          )}

          <div className="pp-reviews-list">
            {loadingReviews ? (
              <p>Loading reviews…</p>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </div>
        </section>
       
      </main>
      <Footer />
    </>
  );
};

export default ProductPage;
