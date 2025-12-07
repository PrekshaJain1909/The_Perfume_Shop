import express from "express";

const router = express.Router();

// static perfume data
const PRODUCTS = [
  {
    id: "1",
    name: "Nocturne Bloom",
    price: 79,
    sizes: [30, 50, 100],
    short: "A sensual floral with amber undertones.",
    description:
      "Nocturne Bloom is a warm, sensual fragrance combining jasmine, amber, and soft sandalwood. Perfect for evening wear.",
    images: [
      "/images/perfume1.png",
      "/images/p2.png",
      "/images/p3.png",
      "/images/p4.png",
    ],
    exclusive: true,
  },
  {
    id: "2",
    name: "Citrus Whisper",
    price: 65,
    sizes: [30, 50],
    short: "Fresh citrus and green notes for daytime.",
    description:
      "Citrus Whisper is bright and lively — top notes of bergamot and mandarin with a clean musk base. Great for spring and daytime.",
    images: [
      "/images/pp1.png",
      "/images/pp2.png",
      "/images/pp3.png",
      "/images/pp4.png",
    ],
  },
  {
    id: "3",
    name: "Velvet Oud",
    price: 120,
    sizes: [50, 100],
    short: "Opulent oud with velvety vanilla.",
    description:
      "Velvet Oud brings deep resinous oud together with a creamy vanilla accord — rich and long-lasting.",
    images: [
      "/images/ppp1.png",
      "/images/ppp2.png",
      "/images/ppp3.png",
      "/images/ppp4.png",
    ],
  },
  {
    id: "4",
    name: "Gardenia Mist",
    price: 58,
    sizes: [30, 50, 75],
    short: "Soft gardenia with a dewy finish.",
    description:
      "Gardenia Mist is a delicate floral perfume that evokes a morning in a blooming garden — airy, pretty, and modern.",
    images: [
       "/images/pppp3.png",
       "/images/pppp1.png",
        "/images/pppp2.png",
       "/images/pppp4.png",
    ],
  },
  {
    id: "5",
    name: "Midday Musk",
    price: 45,
    sizes: [30, 50],
    short: "A clean musk perfect for daily wear.",
    description:
      "Midday Musk blends soft musk with hints of citrus and white woods — simple, modern, and comforting.",
    images: [
      "/images/ppppp1.png",
      "/images/ppppp2.png",
      "/images/ppppp3.png",
      "/images/ppppp4.png",
    ],
  },
];

// 🔹 In-memory reviews store: { [productId]: [review, ...] }
const REVIEWS = {
  // optional: some initial sample reviews
  // "1": [
  //   {
  //     id: "r1",
  //     authorName: "Aarav",
  //     rating: 5,
  //     comment: "Amazing fragrance, lasts all day!",
  //     createdAt: new Date().toISOString(),
  //   },
  // ],
};

// route: GET /api/products
router.get("/", (req, res) => {
  res.json(PRODUCTS);
});

// route: GET /api/products/:id
router.get("/:id", (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// 🔹 GET /api/products/:id/reviews
router.get("/:id/reviews", (req, res) => {
  const { id } = req.params;

  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const productReviews = REVIEWS[id] || [];
  res.json(productReviews);
});

// 🔹 POST /api/products/:id/reviews
router.post("/:id/reviews", (req, res) => {
  const { id } = req.params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { authorName, rating, comment } = req.body;

  if (!authorName || !comment || typeof rating !== "number") {
    return res
      .status(400)
      .json({ message: "authorName, rating and comment are required" });
  }

  const newReview = {
    id: Date.now().toString(),
    authorName,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  if (!REVIEWS[id]) REVIEWS[id] = [];
  REVIEWS[id].unshift(newReview);

  return res.status(201).json(newReview);
});

export default router;
