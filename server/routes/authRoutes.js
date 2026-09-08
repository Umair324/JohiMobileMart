import express from "express";
import rateLimit from "express-rate-limit";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});
router.use(authLimiter);

router.post("/register", async (req, res) => {
  try {
    const { name, phone, whatsapp, email, password, location } = req.body;
    if (!name || !phone || !whatsapp || !password) {
      return res.status(400).json({ message: "Name, phone, whatsapp and password are required" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({ message: "An account with this phone number already exists. Please sign in instead." });
    }

    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(409).json({ message: "An account with this email already exists. Please sign in instead." });
      }
    }

    const user = await User.create({
      name,
      phone,
      whatsapp,
      email,
      password,
      location: location || "Johi",
    });

    res.status(201).json({ user: user.toSafeJSON(), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Phone/email and password are required" });
    }

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier?.toLowerCase() }],
    });

    if (!user) {
      return res.status(404).json({ message: "No account found with this phone/email. Please sign up first." });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    res.json({ user: user.toSafeJSON(), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { credential, intent } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ googleId });
    let needsLinking = false;

    if (!user) {
      user = await User.findOne({ email });
      if (user) needsLinking = true;
    }

    if (user) {
      if (intent === "signup") {
        return res.status(409).json({
          message: "An account with this email already exists. Please sign in instead.",
        });
      }
      if (needsLinking) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      if (intent === "login") {
        return res.status(404).json({
          message: "No account found with this email. Please sign up first.",
        });
      }
      user = await User.create({
        name,
        email,
        googleId,
        needsProfileCompletion: true,
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    res.json({ user: user.toSafeJSON(), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

router.put("/me", protect, upload.single("avatar"), async (req, res) => {
  try {
    const { name, whatsapp, location } = req.body;
    if (name) req.user.name = name;
    if (whatsapp) req.user.whatsapp = whatsapp;
    if (location) req.user.location = location;

    if (req.file) {
      req.user.avatar = req.file.path;
    }

    await req.user.save();
    res.json({ user: req.user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/complete-profile", protect, async (req, res) => {
  try {
    const { phone, whatsapp, location } = req.body;
    if (!phone || !whatsapp) {
      return res.status(400).json({ message: "Phone and WhatsApp number are required" });
    }
    const existing = await User.findOne({ phone, _id: { $ne: req.user._id } });
    if (existing) {
      return res.status(409).json({ message: "An account with this phone number already exists" });
    }

    req.user.phone = phone;
    req.user.whatsapp = whatsapp;
    if (location) req.user.location = location;
    req.user.needsProfileCompletion = false;
    await req.user.save();

    res.json({ user: req.user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;