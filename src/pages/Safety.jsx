import { ShieldAlert, CheckCircle2 } from "lucide-react";

const TIPS = [
  "Meet in a public place.",
  "Check the phone before payment.",
  "Verify IMEI.",
  "Check PTA status.",
  "Test camera, display, speakers and charging.",
  "Never send advance payment to unknown sellers.",
  "Do not share OTPs or passwords.",
];

export default function Safety() {
  return (
    <div className="container-page max-w-2xl py-12">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-alert-light text-alert">
        <ShieldAlert size={24} />
      </div>
      <h1 className="text-3xl font-bold">Buy & Sell Safely</h1>
      <p className="mt-3 text-ink-light">
        Johi Mobile Mart connects buyers and sellers directly, which means safety is
        a shared responsibility. Follow these guidelines every time you meet someone
        from a listing.
      </p>

      <ul className="mt-6 space-y-3">
        {TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-3 rounded-tag border border-paper-line bg-white p-3.5">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-bazaar-500" />
            <span className="text-sm text-ink-light">{tip}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-tag bg-alert-light px-4 py-3 text-sm font-medium text-alert">
        Johi Mobile Mart does not guarantee transactions between buyers and sellers.
        Always inspect the phone before making payment.
      </p>
    </div>
  );
}
