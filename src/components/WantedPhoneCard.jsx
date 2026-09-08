import { useState } from "react";
import { MessageCircle, MapPin, Phone, ShieldCheck } from "lucide-react";
import { formatPKR, timeAgo, whatsappLink } from "../utils/format";
import Badge from "./Badge";
import Modal from "./Modal";

export default function WantedPhoneCard({ wanted }) {
  const [open, setOpen] = useState(false);
  const waMessage = `Assalam o Alaikum, I saw your "${wanted.title}" request on Johi Mobile Mart. I have a matching phone for sale.`;
  const telHref = wanted.phone ? `tel:${String(wanted.phone).replace(/[^0-9+]/g, "")}` : null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="card-surface price-tag-notch w-full p-4 text-left transition hover:-translate-y-0.5 hover:shadow-cardHover sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold text-ink">{wanted.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
              <MapPin size={12} /> {wanted.location} • {timeAgo(wanted.createdAt || wanted.postedAt)}
            </p>
          </div>
          <Badge variant="amber">Wanted</Badge>
        </div>

        <p className="mt-3 text-sm font-bold text-bazaar-600">
          {formatPKR(wanted.minBudget)} – {formatPKR(wanted.maxBudget)}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="ink">{wanted.condition}</Badge>
          {wanted.ptaRequired && <Badge variant="green"><ShieldCheck size={12} /> PTA required</Badge>}
        </div>

        <p className="mt-3 text-sm text-ink-light line-clamp-2">{wanted.description}</p>

        {wanted.phone && <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-ink"><Phone size={14} /> {wanted.phone}</p>}

        <span className="mt-4 flex w-full items-center justify-center gap-2 rounded-tag border border-paper-line py-2 text-xs font-semibold text-ink-light">View Details</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={wanted.title}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-ink-faint">Budget</p>
              <p className="font-semibold text-bazaar-600">{formatPKR(wanted.minBudget)} – {formatPKR(wanted.maxBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Condition</p>
              <p className="font-medium text-ink">{wanted.condition}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Location</p>
              <p className="font-medium text-ink">{wanted.location}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Storage</p>
              <p className="font-medium text-ink">{wanted.minStorage || "Any"}</p>
            </div>
            {wanted.ptaRequired && (
              <div className="col-span-2">
                <Badge variant="green"><ShieldCheck size={12} /> PTA approved required</Badge>
              </div>
            )}
          </div>

          {wanted.description && (
            <div>
              <p className="mb-1 text-xs text-ink-faint">Description</p>
              <p className="text-sm text-ink-light">{wanted.description}</p>
            </div>
          )}

          <div className="flex flex-col gap-2.5 border-t border-paper-line pt-4 sm:flex-row">
            {telHref && <a href={telHref} className="btn-secondary flex-1"><Phone size={16} /> Call {wanted.phone}</a>}
            <a href={whatsappLink(wanted.phone || wanted.buyer?.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" className="btn flex-1 bg-[#22C35E] text-white hover:bg-[#1DA851]"><MessageCircle size={16} /> WhatsApp</a>
          </div>
        </div>
      </Modal>
    </>
  );
}