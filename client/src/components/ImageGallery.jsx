import { useState } from "react";
import "./ImageGallery.css";

const ImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return null; // or show a placeholder if you want
  }

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  const goPrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setActiveIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="gallery">
      <div className="gallery-main-wrapper">
        {images.length > 1 && (
          <button
            className="gallery-nav-btn left"
            type="button"
            onClick={goPrev}
          >
            ‹
          </button>
        )}

        <img
          src={images[activeIndex]}
          alt={`Product ${activeIndex + 1}`}
          className="gallery-main-image"
        />

        {images.length > 1 && (
          <button
            className="gallery-nav-btn right"
            type="button"
            onClick={goNext}
          >
            ›
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              className={`gallery-thumbnail-btn ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={src}
                alt={`Thumb ${index + 1}`}
                className="gallery-thumbnail-image"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
