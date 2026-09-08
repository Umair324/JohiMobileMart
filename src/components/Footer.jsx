import { Link } from "react-router-dom";
import { Smartphone, Globe,  MessageCircle } from "lucide-react";

const COLS = [
  {
    title: "Marketplace",
    links: [
      { to: "/", label: "Home" },
      { to: "/mobiles", label: "Buy Mobile" },
      { to: "/sell", label: "Sell Mobile" },
      { to: "/wanted-phones", label: "Wanted Phones" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/how-it-works", label: "How It Works" },
      { to: "/safety", label: "Safety Tips" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
    ],
  },
];

// Neeche footer se click hone par top par scroll kar do
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "instant" });

export default function Footer() {
  return (
    <footer className="border-t border-paper-line bg-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-tag bg-bazaar-500 text-white">
                <Smartphone size={19} />
              </span>
              <span className="font-display text-base font-extrabold text-ink">
                Johi Mobile Mart
              </span>
            </Link>
            <p className="mt-3 text-sm text-ink-faint">
              Buy & Sell Mobile Phones Directly in Johi
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                to="/"
                onClick={scrollToTop}
                aria-label="Home"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink-faint hover:bg-bazaar-50 hover:text-bazaar-600"
              >
                <Globe size={16} />
              </Link>
              <Link
                to="/mobiles"
                onClick={scrollToTop}
                aria-label="Browse phones"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink-faint hover:bg-bazaar-50 hover:text-bazaar-600"
              >
                <Smartphone size={16} />
              </Link>
              <Link
                to="/contact"
                onClick={scrollToTop}
                aria-label="Contact us"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink-faint hover:bg-bazaar-50 hover:text-bazaar-600"
              >
                <MessageCircle size={16} />
              </Link>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-bold text-ink">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={scrollToTop}
                      className="text-sm text-ink-faint hover:text-bazaar-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-paper-line pt-6">
          <p className="text-xs text-ink-faint text-center">
            Johi Mobile Mart is a marketplace platform and does not act as the seller
            or buyer of listed phones. Always inspect a phone in person before paying.
          </p>
          <p className="mt-3 text-center text-xs text-ink-faint">
            © 2026 Johi Mobile Mart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}