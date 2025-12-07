import "./ReviewList.css";

const ReviewList = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list-container">
        <p className="review-list-empty">
          No reviews yet. Be the first to share your experience ✨
        </p>
      </div>
    );
  }

  const averageRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

  return (
    <div className="review-list-container">

      <div className="review-list-items">
        {reviews.map((review) => (
          <div className="review-card" key={review._id || review.createdAt}>
            <div className="review-card-header">
              <div className="review-header-left">
                <p className="review-author">
                  {review.authorName || "Anonymous"}
                </p>
                <p className="review-date">
                  {formatDate(review.createdAt || review.date)}
                </p>
              </div>

              <div className="review-card-rating">
                {renderStars(review.rating || 0)}
              </div>
            </div>

            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helpers

const renderStars = (rating) => {
  const total = 5;
  const filled = Math.max(0, Math.min(rating, total));
  const stars = [];

  for (let i = 1; i <= total; i++) {
    stars.push(
      <span
        key={i}
        className={`review-star ${i <= filled ? "filled" : "empty"}`}
      >
        ★
      </span>
    );
  }

  return stars;
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default ReviewList;
