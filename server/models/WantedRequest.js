import mongoose from "mongoose";

const wantedSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    minBudget: { type: Number, default: 0 },
    maxBudget: { type: Number, required: true },
    condition: { type: String, default: "Any" },
    minStorage: { type: String, default: "" },
    ptaRequired: { type: Boolean, default: false },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("WantedRequest", wantedSchema);