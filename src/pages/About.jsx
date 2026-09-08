import { Handshake, BadgePercent, MapPinned, ShieldCheck } from "lucide-react";

const POINTS = [
  {
    icon: Handshake,
    title: "Direct connection",
    text: "We remove the shop from the middle so buyers and sellers deal with each other directly.",
  },
  {
    icon: BadgePercent,
    title: "Fair pricing",
    text: "Sellers keep more of what a phone is really worth, and buyers pay less than shop mark-ups.",
  },
  {
    icon: MapPinned,
    title: "Built for Johi",
    text: "Started for Johi's local market, with room to grow into Dadu, Mehar and nearby towns.",
  },
  {
    icon: ShieldCheck,
    title: "Safety-first",
    text: "Clear safety guidance and reporting tools help buyers and sellers deal with confidence.",
  },
];

export default function About() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-3xl font-bold">About Johi Mobile Mart</h1>
      <p className="mt-4 text-ink-light leading-relaxed">
        In Johi, buying or selling a used phone usually means visiting a local shop.
        The shop buys low from a seller, adds its margin, and sells high to a buyer —
        and neither side gets a fair deal, or a real choice. Johi Mobile Mart was
        built to fix that: a direct marketplace where sellers list their own phones
        and buyers reach out to them without a shop in between.
      </p>
      <p className="mt-4 text-ink-light leading-relaxed">
        We're starting focused on Johi because we know this market best, but the
        platform is built to grow to Dadu, Mehar, Khairpur Nathan Shah, Larkana and
        beyond.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {POINTS.map((p) => (
          <div key={p.title} className="card-surface p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-bazaar-50 text-bazaar-600">
              <p.icon size={19} />
            </div>
            <h3 className="font-bold text-ink">{p.title}</h3>
            <p className="mt-1 text-sm text-ink-faint">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
