import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Handshake,
  BadgePercent,
  MapPinned,
  UploadCloud,
  Search as SearchIcon,
  ScaleIcon,
  Phone as PhoneCallIcon,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";
import MobileGrid from "../components/MobileGrid";
import LoadingState from "../components/LoadingState";
import WantedPhoneCard from "../components/WantedPhoneCard";
import { categories } from "../data/categories";
import { listingsApi } from "../api/listings";
import { wantedApi } from "../api/misc";

const WHY_CARDS = [
  { icon: Handshake, title: "Direct Connection", text: "Buyers and sellers connect directly, no shop or middleman in between." },
  { icon: BadgePercent, title: "Better Prices", text: "Cut out unnecessary shop margins and get a fairer price both ways." },
  { icon: MapPinned, title: "Local Marketplace", text: "Find phones from real people in Johi and nearby towns you can actually meet." },
  { icon: UploadCloud, title: "Easy Selling", text: "Upload photos and phone details, then publish your listing in minutes." },
];

const BUYER_STEPS = [
  { icon: SearchIcon, title: "Search", text: "Find the phone you need." },
  { icon: ScaleIcon, title: "Compare", text: "Check price, condition and specifications." },
  { icon: PhoneCallIcon, title: "Contact", text: "Call or WhatsApp the seller." },
  { icon: CheckCircle2, title: "Inspect & Buy", text: "Meet safely, inspect the phone and complete the deal." },
];

const SELLER_STEPS = [
  { icon: UploadCloud, title: "Add Phone", text: "Enter phone information." },
  { icon: SearchIcon, title: "Upload Photos", text: "Add clear images." },
  { icon: BadgePercent, title: "Set Price", text: "Choose your asking price." },
  { icon: PhoneCallIcon, title: "Connect", text: "Receive calls and WhatsApp messages from buyers." },
];

const SAFETY_TIPS = [
  "Meet in a public place.",
  "Check the phone before payment.",
  "Verify IMEI.",
  "Check PTA status.",
  "Test camera, display, speakers and charging.",
  "Never send advance payment to unknown sellers.",
  "Do not share OTPs or passwords.",
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [wanted, setWanted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [newest, wantedData] = await Promise.all([
          listingsApi.browse({ sort: "newest", limit: 8 }),
          wantedApi.browse(),
        ]);
        setFeatured(newest.items.slice(0, 4));
        setRecent(newest.items.slice(4, 8));
        setWanted(wantedData.items.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-paper-line bg-gradient-to-b from-bazaar-50 to-paper">
        <div className="container-page py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bazaar-200 bg-white px-3.5 py-1.5 text-xs font-bold text-bazaar-700">
              📍 Johi's Local Mobile Marketplace
            </span>
            <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
              Buy & Sell Mobile Phones Directly in Johi
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-light sm:text-lg">
              Find your next phone or sell your old one without unnecessary middlemen.
              Connect directly with local buyers and sellers.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center padding-12 gap-3 sm:flex-row">
              <Link to="/mobiles" className="btn-primary w-full sm:w-auto">
                Browse Mobiles <ArrowRight size={17} />
              </Link>
              <Link to="/sell" className="btn-secondary w-full sm:w-auto">
                Sell Your Phone
              </Link>
            </div>

            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar size="lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">Shop by Brand</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {error && (
        <div className="container-page">
          <div className="mb-6 rounded-tag bg-alert-light px-4 py-3 text-sm text-alert">
            Couldn't load live listings from the server: {error}. Make sure the backend
            is running (see server/README.md).
          </div>
        </div>
      )}

      <section className="bg-white border-y border-paper-line py-10 sm:py-14">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">Featured Mobiles</h2>
            <Link to="/mobiles" className="flex items-center gap-1 text-sm font-semibold text-bazaar-600">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {loading ? <LoadingState count={4} /> : <MobileGrid mobiles={featured} />}
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">Recently Added</h2>
          <Link to="/mobiles" className="flex items-center gap-1 text-sm font-semibold text-bazaar-600">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        {loading ? <LoadingState count={4} /> : <MobileGrid mobiles={recent} />}
      </section>

      <section className="bg-white border-y border-paper-line py-10 sm:py-14">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Wanted Phones</h2>
              <p className="mt-1 text-sm text-ink-faint">
                Buyers looking for a specific phone — maybe you have it.
              </p>
            </div>
            <Link to="/wanted-phones" className="flex items-center gap-1 text-sm font-semibold text-bazaar-600">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wanted.map((w) => (
              <WantedPhoneCard key={w._id} wanted={w} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <h2 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          Why Johi Mobile Mart?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CARDS.map((c) => (
            <div key={c.title} className="card-surface p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bazaar-50 text-bazaar-600">
                <c.icon size={22} />
              </div>
              <h3 className="font-bold text-ink">{c.title}</h3>
              <p className="mt-1.5 text-sm text-ink-faint">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bazaar-900 py-12 sm:py-16 text-white">
        <div className="container-page">
          <h2 className="mb-8 text-center text-xl font-bold sm:text-2xl">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-bazaar-200">
                For Buyers
              </h3>
              <div className="space-y-4">
                {BUYER_STEPS.map((s, i) => (
                  <div key={s.title} className="flex gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bazaar-700 text-sm font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold">{s.title}</p>
                      <p className="text-sm text-bazaar-100">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-tag-light">
                For Sellers
              </h3>
              <div className="space-y-4">
                {SELLER_STEPS.map((s, i) => (
                  <div key={s.title} className="flex gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tag-dark text-sm font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold">{s.title}</p>
                      <p className="text-sm text-bazaar-100">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="card-surface flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-alert-light text-alert">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold sm:text-xl">Buy Safely</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {SAFETY_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-ink-light">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-bazaar-500" />
                  {tip}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-tag bg-alert-light px-4 py-3 text-sm font-medium text-alert">
              Johi Mobile Mart does not guarantee transactions between buyers and sellers.
              Always inspect the phone before making payment.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-tag py-12 text-center text-white sm:py-16">
        <div className="container-page">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Have a phone to sell?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-tag-light">
            List it in minutes and start getting calls from local buyers in Johi today.
          </p>
          <Link to="/sell" className="btn mt-6 inline-flex bg-white text-tag-dark hover:bg-paper">
            + Sell Your Phone
          </Link>
        </div>
      </section>
    </div>
  );
}
