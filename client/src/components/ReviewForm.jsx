import { useState } from "react";
import "./ReviewForm.css";

const initialFormState = {
  authorName: "",
  rating: 5,
  comment: "",
};

const ReviewForm = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.authorName.trim() || !formData.comment.trim()) {
      setError("Please add your name and a short review.");
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setFormData(initialFormState);
    } catch (err) {
      console.error("Submit review error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">Share Your Experience</h3>

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-form-row">
          <div className="review-form-field">
            <label htmlFor="authorName">Name</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              placeholder="How should we address you?"
              value={formData.authorName}
              onChange={handleChange}
            />
          </div>

          <div className="review-form-field">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value={5}>⭐️⭐️⭐️⭐️⭐️</option>
              <option value={4}>⭐️⭐️⭐️⭐️</option>
              <option value={3}>⭐️⭐️⭐️</option>
              <option value={2}>⭐️⭐️</option>
              <option value={1}>⭐️</option>
            </select>
          </div>
        </div>

        <div className="review-form-field">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            name="comment"
            placeholder="Tell others how this fragrance feels on you..."
            rows={4}
            value={formData.comment}
            onChange={handleChange}
          />
        </div>

        {error && <p className="review-form-error">{error}</p>}

        <button
          type="submit"
          className="review-form-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Post Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
