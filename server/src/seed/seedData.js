// server/src/seed/seedData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/perfumeShop";

const productsData = [
  {
    name: "Midnight Bloom",
    shortDescription: "Floral, elegant & long-lasting",
    fullDescription:
      "Midnight Bloom blends night-jasmine and rose with soft amber to create a perfume that stays for 12+ hours. Perfect for romantic evenings and celebrations.",
    price: 2499,
    sizes: ["30ml", "50ml", "100ml"],
    images: [
      "https://i.ibb.co/3v5G9gq/perfume1-1.jpg",
      "https://i.ibb.co/JngR6vR/perfume1-2.jpg",
      "https://i.ibb.co/Gs9XRLj/perfume1-3.jpg",
    ],
  },
  {
    name: "Royal Oud",
    shortDescription: "Bold & unforgettable Arabian fragrance",
    fullDescription:
      "Royal Oud is a powerful blend of oud wood, musk and smoky vanilla. Ideal for confident personalities who like to leave a mark wherever they go.",
    price: 2999,
    sizes: ["30ml", "60ml"],
    images: [
      "https://i.ibb.co/vwY7GWk/perfume2-1.jpg",
      "https://i.ibb.co/G38y8Hd/perfume2-2.jpg",
    ],
  },
  {
    name: "Ocean Breeze",
    shortDescription: "Fresh, sporty & summer-friendly",
    fullDescription:
      "Ocean Breeze captures the freshness of sea mist and citrus. A clean daytime perfume perfect for college students and everyday wear.",
    price: 1799,
    sizes: ["20ml", "50ml", "100ml"],
    images: [
      "https://i.ibb.co/yhvMQb2/perfume3-1.jpg",
      "https://i.ibb.co/5nsf6dr/perfume3-2.jpg",
      "https://i.ibb.co/NmB2twF/perfume3-3.jpg",
    ],
  },
  {
    name: "Vanilla Kiss",
    shortDescription: "Sweet & romantic with warm vanilla tones",
    fullDescription:
      "Vanilla Kiss mixes Madagascar vanilla with soft caramel and berries. A cozy and warm scent for winter and festive occasions.",
    price: 2299,
    sizes: ["30ml", "50ml"],
    images: [
      "https://i.ibb.co/c1wN60X/perfume4-1.jpg",
      "https://i.ibb.co/cChYh20/perfume4-2.jpg",
    ],
  },
];

const reviewsData = [
  {
    authorName: "Teena",
    rating: 5,
    comment: "Amazing fragrance and lasts very long!",
  },
  {
    authorName: "Rohan",
    rating: 4,
    comment: "Smells luxury! Little strong but I loved it.",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🌸 Connected to MongoDB");

    // Clear DB first
    await Product.deleteMany();
    await Review.deleteMany();
    console.log("🗑 Old data removed");

    // Insert products
    const createdProducts = await Product.insertMany(productsData);
    console.log("✨ Products inserted");

    // Insert sample reviews for first product only
    const firstProductId = createdProducts[0]._id;

    const reviewsToInsert = reviewsData.map((r) => ({
      ...r,
      product: firstProductId,
    }));

    await Review.insertMany(reviewsToInsert);
    console.log("⭐ Sample reviews added");

    console.log("🎉 Database seeding finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
