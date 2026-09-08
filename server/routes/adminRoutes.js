import express from "express";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import WantedRequest from "../models/WantedRequest.js";
import { Report, ContactMessage } from "../models/misc.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, adminOnly);

router.get("/stats", async (req, res) => {
  const [totalUsers, activeListings, soldPhones, wantedRequests, pendingListings, openReports] =
    await Promise.all([
      User.countDocuments(),
      Listing.countDocuments({ status: "active", approvalStatus: "approved" }),
      Listing.countDocuments({ status: "sold" }),
      WantedRequest.countDocuments({ status: "open" }),
      Listing.countDocuments({ approvalStatus: "pending" }),
      Report.countDocuments({ status: "open" }),
    ]);

  res.json({
    totalUsers,
    activeListings,
    soldPhones,
    wantedRequests,
    pendingListings,
    openReports,
  });
});

router.get("/listings", async (req, res) => {
  const { status, approvalStatus } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (approvalStatus) filter.approvalStatus = approvalStatus;
  const items = await Listing.find(filter)
    .populate("seller", "name phone location")
    .sort({ createdAt: -1 });
  res.json({ items });
});

router.patch("/listings/:id/approve", async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: "approved" },
    { new: true }
  );
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.json({ listing });
});

router.patch("/listings/:id/reject", async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: "rejected" },
    { new: true }
  );
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.json({ listing });
});

router.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "Listing deleted" });
});

router.get("/users", async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  const withCounts = await Promise.all(
    users.map(async (u) => {
      const listingCount = await Listing.countDocuments({ seller: u._id });
      return { ...u.toSafeJSON(), listingCount };
    })
  );
  res.json({ items: withCounts });
});

router.patch("/users/:id/suspend", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isSuspended = !user.isSuspended;
  await user.save();
  res.json({ user: user.toSafeJSON() });
});

router.get("/reports", async (req, res) => {
  const reports = await Report.find({ status: "open" })
    .populate("listing", "brand model variant")
    .populate("reporter", "name")
    .sort({ createdAt: -1 });
  res.json({ items: reports });
});

router.delete("/reports/:id", async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, { status: "resolved" });
  res.json({ message: "Report resolved" });
});

router.get("/wanted", async (req, res) => {
  const items = await WantedRequest.find().populate("buyer", "name").sort({ createdAt: -1 });
  res.json({ items });
});

router.delete("/wanted/:id", async (req, res) => {
  await WantedRequest.findByIdAndDelete(req.params.id);
  res.json({ message: "Wanted request deleted" });
});

router.get("/contact-messages", async (req, res) => {
  const items = await ContactMessage.find({ status: "open" }).sort({ createdAt: -1 });
  res.json({ items });
});

router.delete("/contact-messages/:id", async (req, res) => {
  await ContactMessage.findByIdAndUpdate(req.params.id, { status: "resolved" });
  res.json({ message: "Message resolved" });
});

export default router;