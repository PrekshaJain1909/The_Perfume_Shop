const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function getWishlist() {
  const token = localStorage.getItem("perfume_auth_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/wishlist/`, { method: "GET", headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch wishlist");
  }
  return res.json();
}

export async function addToWishlist(productId) {
  const token = localStorage.getItem("perfume_auth_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}/wishlist`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add to wishlist");
  }
  return res.json();
}

export async function removeFromWishlist(productId) {
  const token = localStorage.getItem("perfume_auth_token");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}/wishlist/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to remove from wishlist");
  }
  return res.json();
}
