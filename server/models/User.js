import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      required: function () {
        return !this.googleId;
      },
    },

    whatsapp: {
      type: String,
      trim: true,
      required: function () {
        return !this.googleId;
      },
    },

    email: { type: String, trim: true, lowercase: true },

    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId;
      },
    },

    googleId: { type: String, unique: true, sparse: true },
    needsProfileCompletion: { type: Boolean, default: false },

    location: { type: String, default: "Johi" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "" },
    avatarInitial: { type: String },
    isSuspended: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    name: this.name,
    phone: this.phone,
    whatsapp: this.whatsapp,
    email: this.email,
    location: this.location,
    role: this.role,
    avatar: this.avatar,
    isSuspended: this.isSuspended,
    rating: this.rating,
    needsProfileCompletion: this.needsProfileCompletion,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("User", userSchema);