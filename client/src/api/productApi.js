// src/api/productApi.js

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Handle HTTP responses in a consistent way.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const errorData = await response.json();
      if (errorData?.message) {
        message = errorData.message;
      }
      console.error("API error details:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
    } catch {
      const text = await response.text().catch(() => "");
      console.error("API error (non-JSON):", {
        status: response.status,
        statusText: response.statusText,
        text,
      });
    }

    throw new Error(message);
  }

  return response.json();
}


/**
 * GET /api/products
 * Returns: [ { _id, name, shortDescription, price, images, ... }, ... ]
 */
export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return handleResponse(res);
}

/**
 * GET /api/products/:id
 * Returns: { _id, name, fullDescription, price, sizes, images, ... }
 */
export async function fetchProductById(id) {
  if (!id) throw new Error("Product ID is required");
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(res);
}

/**
 * GET /api/products/:id/reviews
 * Returns: [ { _id, authorName, rating, comment, createdAt, ... }, ... ]
 */
export async function fetchReviews(productId) {
  if (!productId) throw new Error("Product ID is required for reviews");
  const res = await fetch(`${BASE_URL}/products/${productId}/reviews`);
  return handleResponse(res);
}

/**
 * POST /api/products/:id/reviews
 * Body: { authorName, rating, comment }
 * Returns: created review object
 */
export async function createReview(productId, data) {
  if (!productId) throw new Error("Product ID is required to create review");

  const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
