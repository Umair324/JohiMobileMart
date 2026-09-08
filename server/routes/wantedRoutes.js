import express from "express";
import WantedRequest from "../models/WantedRequest.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await WantedRequest.find({ status: "open" })
    .populate("buyer", "name whatsapp")
    .sort({ createdAt: -1 });
  res.json({ items });
});

router.get("/mine", protect, async (req, res) => {
  const items = await WantedRequest.find({ buyer: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
});

router.post("/", protect, async (req, res) => {
  try {
    const body = req.body;
    const wanted = await WantedRequest.create({
      buyer: req.user._id,
      title: body.title || `Looking for ${body.brand} ${body.model}`,
      brand: body.brand,
      model: body.model,
      minBudget: Number(body.minBudget) || 0,
      maxBudget: Number(body.maxBudget),
      condition: body.condition || "Any",
      minStorage: body.minStorage,
      ptaRequired: !!body.ptaRequired,
      location: body.location,
      phone: body.phone,
      description: body.description,
    });
    res.status(201).json({ wanted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  const wanted = await WantedRequest.findById(req.params.id);
  if (!wanted) return res.status(404).json({ message: "Not found" });
  if (String(wanted.buyer) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  await wanted.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;