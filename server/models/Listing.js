import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, default: "" },
    color: { type: String, default: "" },
    storage: { type: String, required: true },
    ram: {  type: String,required: function () {
    return this.brand !== "Apple";
  }, },
    condition: { type: String, required: true },
    batteryHealth: { type: Number, default: 90 },
    pta: { type: String, enum: ["PTA Approved", "Non-PTA", "Unknown" ,"JV"], default: "Unknown" },
    sim: { type: String, default: "Dual SIM" },
    accessories: { type: [String], default: [] },
    price: { type: Number, required: true },
    priceType: { type: String, enum: ["Fixed Price", "Negotiable"], default: "Negotiable" },
    location: { type: String, required: true },
    area: { type: String, default: "" },
    purchaseYear: { type: Number },
    boxAvailable: { type: Boolean, default: false },
    chargerAvailable: { type: Boolean, default: false },
    repairHistory: { type: String, default: "None" },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "sold", "expired"], default: "active" },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

listingSchema.index({ brand: "text", model: "text", variant: "text", location: "text" });

export default mongoose.model("Listing", listingSchema);
