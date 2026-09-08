import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, Star, Loader2 } from "lucide-react";
import { whatsappLink, telLink } from "../utils/format";
import { listingsApi } from "../api/listings";
import { messagesApi } from "../api/misc";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import { resolveImageUrl } from "../api/client";

export default function SellerCard({ seller, mobile }) {
  const [contact, setContact] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const listingId = mobile._id || mobile.id;
  const waMessage = `Assalam o Alaikum, I saw your ${mobile.model} ${mobile.variant} listing on Johi Mobile Mart. Is it still available?`;

  const revealContact = async () => {
    if (!user) {
      showToast("Please login to view seller contact details.", "info");
      navigate("/login");
      return;
    }
    setLoadingContact(true);
    try {
      const data = await listingsApi.contact(listingId);
      setContact(data);
    } catch (err) {
      showToast(err.message, "warning");
    } finally {
      setLoadingContact(false);
    }
  };

  const messageSeller = async () => {
    if (!user) {
      showToast("Please login to message the seller.", "info");
      navigate("/login");
      return;
    }
    const sellerId = seller.id || seller._id;
    if (String(sellerId) === String(user.id)) {
      showToast("This is your own listing.", "info");
      return;
    }
    setSendingMessage(true);
    try {
      const { conversationId } = await messagesApi.start({
        toUserId: sellerId,
        listingId,
        text: waMessage,
      });
      navigate(`/messages?c=${conversationId}`);
    } catch (err) {
      showToast(err.message, "warning");
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="card-surface p-5">
      <h3 className="mb-3.5 font-display text-base font-bold text-ink">Seller Information</h3>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-bazaar-100 font-display text-lg font-bold text-bazaar-700">
          {seller.avatar ? (
            <img src={resolveImageUrl(seller.avatar)} alt={seller.name} className="h-full w-full object-cover" />
          ) : (
            seller.name?.charAt(0)
          )}
        </div>
        <div>
          <p className="flex items-center gap-1 font-semibold text-ink">
            {seller.name}
            <ShieldCheck size={14} className="text-bazaar-500" />
          </p>
          <p className="flex items-center gap-1 text-xs text-ink-faint">
            <MapPin size={11} /> {seller.location}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
        <span>
          Member since{" "}
          {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
        </span>
        <span className="flex items-center gap-1 font-semibold text-tag-dark">
          <Star size={12} className="fill-tag text-tag" /> {seller.rating || 5}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {!contact ? (
          <button onClick={revealContact} disabled={loadingContact} className="btn-secondary w-full">
            {loadingContact ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
            Show Contact Options
          </button>
        ) : (
          <>
            <a href={telLink(contact.phone)} className="btn-primary w-full">
              <Phone size={16} /> Call Seller
            </a>
            <a href={whatsappLink(contact.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" className="btn w-full bg-[#22C35E] text-white hover:bg-[#1DA851]">
              <MessageCircle size={16} /> WhatsApp Seller
            </a>
          </>
        )}
        <button onClick={messageSeller} disabled={sendingMessage} className="btn-ghost w-full border border-paper-line">
          {sendingMessage ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
          Message Seller
        </button>
      </div>

      <p className="mt-3 text-center text-[11px] text-ink-faint">
        Phone number is hidden until you request it, to protect seller privacy.
      </p>
    </div>
  );
}