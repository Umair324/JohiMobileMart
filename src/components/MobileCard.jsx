import { Link } from "react-router-dom";
import { Heart, MapPin, BatteryMedium, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import ListingImage from "./ListingImage";
import Badge from "./Badge";
import { formatPKR, timeAgo } from "../utils/format";
import { useFavorites } from "../hooks/useFavorites";

const PTA_DISPLAY = {
  "PTA Approved": { variant: "green", icon: ShieldCheck, label: "PTA Approved" },
  "Non-PTA": { variant: "red", icon: ShieldAlert, label: "Non-PTA" },
  "Unknown": { variant: "ink", icon: ShieldQuestion, label: "PTA Unknown" },
};

export default function MobileCard({ mobile }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const id = mobile._id || mobile.id;
  const fav = isFavorite(id);
  const isSold = mobile.status === "sold";
  const ptaInfo = PTA_DISPLAY[mobile.pta];

  return (
    <div className="group relative card-surface overflow-hidden hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-150">
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(id);
        }}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={fav}
        className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white"
      >
        <Heart
          size={16}
          className={fav ? "fill-alert text-alert" : "text-ink-light"}
        />
      </button>

      <Link to={`/mobile/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper">
          <ListingImage
            image={mobile.images?.[0]}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
              <span className="rotate-[-8deg] rounded-tag border-2 border-white px-4 py-1 text-lg font-extrabold tracking-wide text-white">
                SOLD
              </span>
            </div>
          )}
          <div className="absolute left-0 top-0 rounded-br-tag bg-tag px-2.5 py-1 text-xs font-bold text-white">
            {mobile.brand}
          </div>
        </div>

        <div className="p-3.5 sm:p-4">
          <h3 className="truncate font-display text-[15px] font-bold text-ink">
            {mobile.brand} {mobile.model} {mobile.variant}
          </h3>
          <p className="mt-0.5 text-lg font-extrabold text-bazaar-600">
            {formatPKR(mobile.price)}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
            <span>{mobile.storage}</span>
            {mobile.ram && (
              <>
                <span aria-hidden="true">•</span>
                <span>{mobile.ram} RAM</span>
              </>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {mobile.brand === "Apple" && (
              <Badge variant="green">
                <BatteryMedium size={12} /> {mobile.batteryHealth}%
              </Badge>
            )}
            {ptaInfo && (
              <Badge variant={ptaInfo.variant}>
                <ptaInfo.icon size={12} /> {ptaInfo.label}
              </Badge>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-paper-line pt-2.5 text-xs text-ink-faint">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {mobile.location}
            </span>
            <span>{timeAgo(mobile.createdAt || mobile.postedAt)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}