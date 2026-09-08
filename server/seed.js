import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Listing from "./models/Listing.js";
import WantedRequest from "./models/WantedRequest.js";
import { Favorite, Report, Conversation, Message } from "./models/misc.js";
import mongoose from "mongoose";

dotenv.config();

// ---------------------------------------------------------------------------
// SAFETY GUARD
// This script wipes every collection before reseeding. Running it against a
// live production database (e.g. wrong .env loaded, or someone runs it on the
// server by habit) would permanently delete all real users, listings, etc.
//
// By default this script REFUSES to run when NODE_ENV=production.
// To intentionally seed a production DB anyway (e.g. first-time setup),
// you must explicitly pass: ALLOW_PROD_SEED=true node seed.js
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "true") {
  console.error(
    "\n🛑 Refusing to run: NODE_ENV=production and ALLOW_PROD_SEED is not set."
  );
  console.error(
    "   This script deletes ALL existing data. If you really mean to seed\n" +
      "   production, re-run with: ALLOW_PROD_SEED=true node seed.js\n"
  );
  process.exit(1);
}

// Demo/admin credentials should come from environment variables in any real
// deployment, not be hardcoded. These fall back to the old dev defaults only
// when the env vars are not set (local/dev use).
const ADMIN_PHONE = process.env.SEED_ADMIN_PHONE || "0300-0000000";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@johimobilemart.pk";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "password123";

const SELLERS = [
  { name: "Aslam Bhutto", phone: "0300-1234567", whatsapp: "0300-1234567", location: "Johi" },
  { name: "Sana Memon", phone: "0301-2345678", whatsapp: "0301-2345678", location: "Johi" },
  { name: "Waqar Junejo", phone: "0302-3456789", whatsapp: "0302-3456789", location: "Dadu" },
  { name: "Imran Chandio", phone: "0303-4567890", whatsapp: "0303-4567890", location: "Johi" },
  { name: "Faisal Kalhoro", phone: "0304-5678901", whatsapp: "0311-5678901", location: "Johi" },
  { name: "Zainab Khaskheli", phone: "0305-6789012", whatsapp: "0305-6789012", location: "Mehar" },
];

const BUYERS = [
  { name: "Kamran Shar", phone: "0321-1112233", whatsapp: "0321-1112233", location: "Johi" },
  { name: "Rehana Bhatti", phone: "0333-2223344", whatsapp: "0333-2223344", location: "Johi" },
  { name: "Yasir Panhwar", phone: "0345-3334455", whatsapp: "0345-3334455", location: "Dadu" },
];

const LISTINGS = [
  { brand: "Apple", model: "iPhone 13", variant: "128GB", color: "Midnight", storage: "128GB", ram: "4GB", condition: "Good", batteryHealth: 89, pta: "PTA Approved", sim: "Dual SIM", price: 145000, priceType: "Negotiable", location: "Johi", area: "Johi Bazaar", accessories: ["Original Box", "Original Charger"], boxAvailable: true, chargerAvailable: true, purchaseYear: 2022, description: "iPhone 13 in excellent working condition. Used carefully with a case and screen protector since day one. Battery health still strong at 89%.", images: ["apple-1", "apple-2", "apple-3"] },
  { brand: "Samsung", model: "Galaxy A54", variant: "256GB", color: "Awesome Violet", storage: "256GB", ram: "8GB", condition: "Like New", batteryHealth: 96, pta: "PTA Approved", sim: "Dual SIM", price: 78000, priceType: "Fixed Price", location: "Johi", area: "Station Road", accessories: ["Original Box", "Original Charger", "Receipt"], boxAvailable: true, chargerAvailable: true, purchaseYear: 2023, description: "Samsung Galaxy A54 5G, barely used for 4 months. Complete box, charger, and unused earphones included.", images: ["samsung-1", "samsung-2"] },
  { brand: "Vivo", model: "V29", variant: "256GB", color: "Himalayan Blue", storage: "256GB", ram: "8GB", condition: "Good", batteryHealth: 91, pta: "PTA Approved", sim: "Dual SIM", price: 89000, priceType: "Negotiable", location: "Dadu", area: "Main Bazaar", accessories: ["Cable"], boxAvailable: true, chargerAvailable: false, purchaseYear: 2023, description: "Vivo V29 with stunning curved AMOLED display. Screen was replaced once with an original part after a minor drop.", images: ["vivo-1", "vivo-2"] },
  { brand: "Oppo", model: "Reno 10", variant: "256GB", color: "Silvery Grey", storage: "256GB", ram: "8GB", condition: "Like New", batteryHealth: 94, pta: "PTA Approved", sim: "Dual SIM", price: 82000, priceType: "Fixed Price", location: "Johi", area: "Johi Bazaar", accessories: ["Original Box", "Original Charger", "Warranty"], boxAvailable: true, chargerAvailable: true, purchaseYear: 2023, description: "Oppo Reno 10 with 100W fast charging. Excellent portrait camera. Hardly used.", images: ["oppo-1", "oppo-2"] },
  { brand: "Xiaomi", model: "Redmi Note 12", variant: "128GB", color: "Onyx Grey", storage: "128GB", ram: "6GB", condition: "Good", batteryHealth: 87, pta: "PTA Approved", sim: "Dual SIM", price: 42000, priceType: "Negotiable", location: "Johi", area: "College Road", accessories: ["Original Charger"], boxAvailable: false, chargerAvailable: true, purchaseYear: 2022, description: "Redmi Note 12 in good daily-use condition. Minor scratches on the back panel, screen is perfect.", images: ["xiaomi-1", "xiaomi-2"] },
  { brand: "Infinix", model: "Note 30", variant: "128GB", color: "Interstellar Blue", storage: "128GB", ram: "8GB", condition: "New", batteryHealth: 100, pta: "PTA Approved", sim: "Dual SIM", price: 38000, priceType: "Fixed Price", location: "Mehar", area: "Mehar Bazaar", accessories: ["Original Box", "Original Charger", "Warranty", "Receipt"], boxAvailable: true, chargerAvailable: true, purchaseYear: 2024, description: "Brand new, sealed box Infinix Note 30. Bought as a gift but not needed. Full warranty valid.", images: ["infinix-1", "infinix-2"] },
];

const WANTED = [
  { title: "Looking for iPhone 13", brand: "Apple", model: "iPhone 13", minBudget: 120000, maxBudget: 140000, condition: "Used / Good", ptaRequired: true, location: "Johi", description: "I am looking for iPhone 13 128GB PTA approved. Budget around Rs. 140,000." },
  { title: "Need Samsung A-series, 8GB RAM", brand: "Samsung", model: "A54 or A55", minBudget: 65000, maxBudget: 85000, condition: "Like New / Good", ptaRequired: true, location: "Johi", description: "Looking for a Samsung A54 or A55 with 8GB RAM, PTA approved, in like-new condition." },
  { title: "Budget phone for student use", brand: "Any", model: "Redmi / Infinix / Tecno", minBudget: 20000, maxBudget: 35000, condition: "Good / Fair", ptaRequired: false, location: "Dadu", description: "Need a simple, working phone for daily calls and study apps." },
];

async function seed() {
  await connectDB();
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Listing.deleteMany({}),
    WantedRequest.deleteMany({}),
    Favorite.deleteMany({}),
    Report.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
  ]);

  console.log("Creating admin account...");
  await User.create({
    name: "Johi Mobile Mart Admin",
    phone: ADMIN_PHONE,
    whatsapp: ADMIN_PHONE,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    location: "Johi",
    role: "admin",
  });

  console.log("Creating sellers and buyers...");
  const sellerDocs = await User.create(
    SELLERS.map((s) => ({ ...s, password: DEMO_PASSWORD }))
  );
  await User.create(BUYERS.map((b) => ({ ...b, password: DEMO_PASSWORD })));

  console.log("Creating listings...");
  await Listing.create(
    LISTINGS.map((l, i) => ({
      ...l,
      seller: sellerDocs[i % sellerDocs.length]._id,
      repairHistory: "None",
    }))
  );

  console.log("Creating wanted requests...");
  const buyerDocs = await User.find({ phone: { $in: BUYERS.map((b) => b.phone) } });
  await WantedRequest.create(
    WANTED.map((w, i) => {
      const buyer = buyerDocs[i % buyerDocs.length];
      return { ...w, buyer: buyer._id, phone: buyer.phone };
    })
  );

  console.log("Seed complete.");
  console.log(`Admin login -> phone: ${ADMIN_PHONE}, password: ${ADMIN_PASSWORD}`);
  console.log(`Demo user login -> phone: 0300-1234567, password: ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});