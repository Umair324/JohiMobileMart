import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

const SUPPORTED_BRANDS = ["Google Pixel", "Samsung", "Infinix", "Realme", "Every Device"];

export default function CpidService() {
  return (
    <div className="container-page py-16">
      <div className="grid overflow-hidden rounded-3xl border border-line lg:grid-cols-5">
        <div className="flex flex-col justify-center bg-bazaar-50 px-8 py-12 sm:px-12 lg:col-span-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-bazaar-600 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-6 text-3xl font-bold text-ink">CPID Service</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            Get your phone's CPID service done reliably, available for every brand.
          </p>
          <Link to="/contact" className="btn-primary mt-8 inline-flex w-fit items-center gap-1.5">
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white px-8 py-12 sm:px-12 lg:col-span-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">
            Available for
          </p>
          <div className="mt-5 divide-y divide-line">
            {SUPPORTED_BRANDS.map((brand) => (
              <div key={brand} className="flex items-center justify-between py-4">
                <p className="font-bold text-ink">{brand}</p>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-tag-dark">
                  <CheckCircle2 className="h-4 w-4" />
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}