import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    let wl = await Wishlist.findOne({ userId }).lean();
    if (!wl) {
      // create empty wishlist document
      await Wishlist.create({ userId, items: [] });
      wl = await Wishlist.findOne({ userId }).lean();
    }
    return res.json(wl.items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const wl = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { items: { productId, addedAt: new Date() } } },
      { upsert: true, new: true }
    );

    return res.json(wl.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "productId required" });

    const wl = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: productId } } },
      { new: true }
    );

    return res.json(wl?.items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};
