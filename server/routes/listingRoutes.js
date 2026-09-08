import express from "express";
import Listing from "../models/Listing.js";
import { Favorite } from "../models/misc.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      q,
      brand,
      condition,
      pta,
      storage,
      ram,
      location,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 8,
    } = req.query;

    const filter = { status: "active", approvalStatus: "approved" };

    const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
    const brands = toArray(brand);
    const conditions = toArray(condition);
    const ptas = toArray(pta);
    const storages = toArray(storage);
    const rams = toArray(ram);
    const locations = toArray(location);

    if (brands.length) filter.brand = { $in: brands };
    if (conditions.length) filter.condition = { $in: conditions };
    if (ptas.length) filter.pta = { $in: ptas };
    if (storages.length) filter.storage = { $in: storages };
    if (rams.length) filter.ram = { $in: rams };
    if (locations.length) filter.location = { $in: locations };
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (q) {
      const words = q.trim().split(/\s+/).filter(Boolean);
      filter.$and = words.map((word) => {
        const regex = new RegExp(word, "i");
        return {
          $or: [
            { brand: regex },
            { model: regex },
            { variant: regex },
            { location: regex },
            { storage: regex },
          ],
        };
      });
    }

    const sortMap = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
    };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const [items, total] = await Promise.all([
      Listing.find(filter)
        .populate("seller", "name location")
        .sort(sortMap[sort] || sortMap.newest)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Listing.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, totalPages: Math.ceil(total / limitNum) || 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/mine", protect, async (req, res) => {
  const items = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
});

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("seller", "name location createdAt rating avatar");
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const json = listing.toObject();
    res.json({ listing: json });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/contact", protect, async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("seller", "name phone whatsapp");
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.json({
    name: listing.seller.name,
    phone: listing.seller.phone,
    whatsapp: listing.seller.whatsapp,
  });
});

router.post("/", protect, upload.array("images", 8), async (req, res) => {
  try {
    const body = req.body;
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: "Please upload at least 2 images" });
    }
    const images = req.files.map((f) => f.path);
    const accessories = Array.isArray(body.accessories)
      ? body.accessories
      : body.accessories
      ? [body.accessories]
      : [];

    const listing = await Listing.create({
      seller: req.user._id,
      brand: body.brand,
      model: body.model,
      variant: body.variant,
      color: body.color,
      storage: body.storage,
      ram: body.ram,
      condition: body.condition,
      batteryHealth: Number(body.batteryHealth) || 90,
      pta: body.pta,
      sim: body.sim,
      accessories,
      price: Number(body.price),
      priceType: body.priceType,
      location: body.city,
      area: body.area,
      description: body.description,
      images,
      approvalStatus: req.user.role === "admin" ? "approved" : "pending",
    });

    res.status(201).json({ listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (String(listing.seller) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to edit this listing" });
  }
  Object.assign(listing, req.body);
  await listing.save();
  res.json({ listing });
});

router.patch("/:id/sold", protect, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (String(listing.seller) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  listing.status = "sold";
  await listing.save();
  res.json({ listing });
});

router.patch("/:id/renew", protect, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (String(listing.seller) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  listing.status = "active";
  listing.createdAt = new Date();
  await listing.save();
  res.json({ listing });
});

router.delete("/:id", protect, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (String(listing.seller) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  await listing.deleteOne();
  res.json({ message: "Listing deleted" });
});

router.post("/:id/favorite", protect, async (req, res) => {
  const existing = await Favorite.findOne({ user: req.user._id, listing: req.params.id });
  if (existing) {
    await existing.deleteOne();
    return res.json({ favorited: false });
  }
  await Favorite.create({ user: req.user._id, listing: req.params.id });
  res.json({ favorited: true });
});

router.get("/user/favorites", protect, async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).populate({
    path: "listing",
    populate: { path: "seller", select: "name location" },
  });
  res.json({ items: favorites.map((f) => f.listing).filter(Boolean) });
});

export default router;