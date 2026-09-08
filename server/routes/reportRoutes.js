import express from "express";
import { Report } from "../models/misc.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", optionalAuth, async (req, res) => {
  const { listingId, reason } = req.body;
  if (!listingId || !reason) {
    return res.status(400).json({ message: "listingId and reason are required" });
  }
  const report = await Report.create({
    listing: listingId,
    reason,
    reporter: req.user ? req.user._id : undefined,
  });
  res.status(201).json({ report });
});

export default router;
