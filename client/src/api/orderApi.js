const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function createOrder(payload) {
  const token = localStorage.getItem("perfume_auth_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create order");
  }

  return res.json();
}

export async function getOrdersByEmail(email) {
  // If email is provided and non-empty, call /orders?email=... otherwise call /orders to get all
  const url = email ? `${BASE_URL}/orders?email=${encodeURIComponent(email)}` : `${BASE_URL}/orders`;
  const token = localStorage.getItem("perfume_auth_token");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch orders");
  }
  return res.json();
}
