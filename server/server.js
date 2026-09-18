import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Listing from "./models/Listing.js";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import wantedRoutes from "./routes/wantedRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);

app.use("/api/listings", listingRoutes);
app.use("/api/wanted", wantedRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Auto-approve any listing that has been sitting in "pending" for more
// than 10 seconds without the admin manually approving/rejecting it.
// Runs every 5 seconds so the delay stays close to the 10s target.
const AUTO_APPROVE_AFTER_MS = 10 * 1000; // 10 seconds
const AUTO_APPROVE_CHECK_INTERVAL_MS = 5 * 1000; // check every 5 seconds

setInterval(async () => {
  try {
    const cutoff = new Date(Date.now() - AUTO_APPROVE_AFTER_MS);
    await Listing.updateMany(
      { approvalStatus: "pending", createdAt: { $lte: cutoff } },
      { $set: { approvalStatus: "approved" } }
    );
  } catch (err) {
    console.error("Auto-approve job failed:", err.message);
  }
}, AUTO_APPROVE_CHECK_INTERVAL_MS);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));