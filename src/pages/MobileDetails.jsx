import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, MapPin, Flag, Eye, ShieldCheck } from "lucide-react";
import ImageGallery from "../components/ImageGallery";
import SellerCard from "../components/SellerCard";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import MobileGrid from "../components/MobileGrid";
import LoadingState from "../components/LoadingState";
import { listingsApi } from "../api/listings";
import { reportsApi } from "../api/misc";
import { formatPKR, timeAgo } from "../utils/format";
import { useFavorites } from "../hooks/useFavorites";
import { useToast } from "../components/Toast";

const REPORT_REASONS = [
  "Fake listing",
  "Wrong information",
  "Suspicious price",
  "Duplicate listing",
  "Scam",
  "Inappropriate content",
  "Phone already sold",
];

export default function MobileDetails() {
  const { id } = useParams();
  const [mobile, setMobile] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    listingsApi
      .detail(id)
      .then(async (data) => {
        setMobile(data.listing);
        try {
          const relatedData = await listingsApi.browse({ brand: data.listing.brand, limit: 5 });
          setRelated(relatedData.items.filter((m) => m._id !== data.listing._id).slice(0, 4));
        } catch {
          setRelated([]);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container-page py-8">
        <LoadingState count={4} />
      </div>
    );
  }

  if (notFound || !mobile) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Listing not found"
          message="This listing may have been removed or the link is incorrect."
          action={
            <Link to="/mobiles" className="btn-primary">
              Browse Mobiles
            </Link>
          }
        />
      </div>
    );
  }

  const specs = [
    ["Brand", mobile.brand],
    ["Model", mobile.model],
    ["Storage", mobile.storage],
    ...(mobile.brand !== "Apple" ? [["RAM", mobile.ram]] : []),
    ...(mobile.brand === "Apple" ? [["Battery Health", `${mobile.batteryHealth}%`]] : []),
    ["PTA Status", mobile.pta],
    ["SIM", mobile.sim],
    ["Color", mobile.color],
    ["Purchase Year", mobile.purchaseYear || "—"],
    ["Box Available", mobile.boxAvailable ? "Yes" : "No"],
    ["Charger Available", mobile.chargerAvailable ? "Yes" : "No"],
    ["Repair History", mobile.repairHistory || "None"],
  ];

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      await reportsApi.create({ listingId: mobile._id, reason: reportReason });
      showToast("Thanks — your report has been submitted for review.", "success");
    } catch (err) {
      showToast(err.message, "warning");
    }
    setReportOpen(false);
    setReportReason("");
  };

  return (
    <div className="container-page py-8">
      <nav className="mb-4 text-xs text-ink-faint">
        <Link to="/" className="hover:text-bazaar-600">Home</Link> /{" "}
        <Link to="/mobiles" className="hover:text-bazaar-600">Buy Mobile</Link> /{" "}
        <span className="text-ink">{mobile.model}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <ImageGallery images={mobile.images} sold={mobile.status === "sold"} />
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                {mobile.model} {mobile.variant}
              </h1>
              <p className="mt-2 text-3xl font-extrabold text-bazaar-600">
                {formatPKR(mobile.price)}
                {mobile.priceType === "Negotiable" && (
                  <span className="ml-2 text-sm font-semibold text-ink-faint">
                    (Negotiable)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => toggleFavorite(mobile._id)}
              aria-label={isFavorite(mobile._id) ? "Remove from favorites" : "Add to favorites"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper-line hover:bg-paper"
            >
              <Heart
                size={19}
                className={isFavorite(mobile._id) ? "fill-alert text-alert" : "text-ink-light"}
              />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-faint">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {mobile.location}, Sindh
            </span>
            <span>•</span>
            <span>{timeAgo(mobile.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {mobile.views} views
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="ink">Condition: {mobile.condition}</Badge>
            {mobile.pta === "PTA Approved" && (
              <Badge variant="green">
                <ShieldCheck size={12} /> PTA Approved
              </Badge>
            )}
          </div>

          <div className="mt-6 card-surface p-5">
            <h2 className="mb-3 font-display text-base font-bold">Specifications</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-ink-faint">{label}</dt>
                  <dd className="font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 card-surface p-5">
            <h2 className="mb-2 font-display text-base font-bold">Description</h2>
            <p className="text-sm leading-relaxed text-ink-light">{mobile.description}</p>
          </div>

          <div className="mt-6">
            <SellerCard seller={mobile.seller} mobile={mobile} />
          </div>

          <button
            onClick={() => setReportOpen(true)}
            className="mt-4 flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-alert"
          >
            <Flag size={14} /> Report Listing
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-xl font-bold">More {mobile.brand} phones</h2>
          <MobileGrid mobiles={related} />
        </section>
      )}

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report Listing"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setReportOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={submitReport} disabled={!reportReason}>
              Submit Report
            </button>
          </>
        }
      >
        <p className="mb-3 text-sm text-ink-faint">
          Let us know what's wrong with this listing.
        </p>
        <div className="space-y-2">
          {REPORT_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-center gap-2 rounded-tag border border-paper-line px-3 py-2 text-sm cursor-pointer hover:border-bazaar-300"
            >
              <input
                type="radio"
                name="report-reason"
                checked={reportReason === reason}
                onChange={() => setReportReason(reason)}
                className="text-bazaar-500 focus:ring-bazaar-300"
              />
              {reason}
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
}
