import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  ListChecks,
  BadgeCheck,
  MessageSquareText,
  Clock,
  Flag,
  Mail,
  Phone,
  Check,
  X,
  Trash2,
  Ban,
  ShieldCheck,
  Loader2,
  Eye,
  MapPin,
  Smartphone,
  HardDrive,
  Cpu,
  Calendar,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Wallet,
  UserCircle,
} from "lucide-react";
import { formatPKR, timeAgo } from "../utils/format";
import { useToast } from "../components/Toast";
import { adminApi } from "../api/misc";
import { resolveImageUrl } from "../api/client";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

const TABS = ["Overview", "Listings", "Pending", "Reports", "Users", "Wanted Requests", "Contact Messages"];

const NO_SCROLLBAR = "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

// Shared detail body (images + specs + description + seller) used by both
// the Pending-approval modal and the general Listing-view modal.
function ListingDetailBody({ listing }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = listing.images || [];
  const hasImages = images.length > 0;

  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);
  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      {hasImages ? (
        <div className="mb-5">
          <div className="relative aspect-video w-full overflow-hidden rounded-tag bg-paper">
            <img
              src={resolveImageUrl(images[activeImg])}
              alt={`${listing.model} photo ${activeImg + 1}`}
              className="h-full w-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className={`mt-2 flex gap-2 overflow-x-auto ${NO_SCROLLBAR}`}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 ${
                    i === activeImg ? "border-bazaar-500" : "border-transparent"
                  }`}
                >
                  <img src={resolveImageUrl(img)} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-5 flex h-40 items-center justify-center gap-2 rounded-tag bg-paper text-sm text-ink-faint">
          <ImageOff size={18} /> No images attached
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs text-ink-faint">Price</p>
          <p className="font-bold text-bazaar-600">{formatPKR(listing.price)}</p>
        </div>
        {listing.condition && (
          <div>
            <p className="text-xs text-ink-faint">Condition</p>
            <p className="font-semibold capitalize">{listing.condition}</p>
          </div>
        )}
        {listing.storage && (
          <div className="flex items-center gap-1">
            <HardDrive size={13} className="text-ink-faint" />
            <div>
              <p className="text-xs text-ink-faint">Storage</p>
              <p className="font-semibold">{listing.storage}</p>
            </div>
          </div>
        )}
        {listing.ram && (
          <div className="flex items-center gap-1">
            <Cpu size={13} className="text-ink-faint" />
            <div>
              <p className="text-xs text-ink-faint">RAM</p>
              <p className="font-semibold">{listing.ram}</p>
            </div>
          </div>
        )}
        {listing.pta !== undefined && listing.pta !== null && listing.pta !== "" && (
          <div className="flex items-center gap-1">
            <Smartphone size={13} className="text-ink-faint" />
            <div>
              <p className="text-xs text-ink-faint">PTA Status</p>
              <p className="font-semibold capitalize">{listing.pta}</p>
            </div>
          </div>
        )}
        {listing.location && (
          <div className="flex items-center gap-1">
            <MapPin size={13} className="text-ink-faint" />
            <div>
              <p className="text-xs text-ink-faint">Location</p>
              <p className="font-semibold">{listing.location}</p>
            </div>
          </div>
        )}
        {listing.createdAt && (
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-ink-faint" />
            <div>
              <p className="text-xs text-ink-faint">{listing.approvalStatus === "pending" ? "Submitted" : "Posted"}</p>
              <p className="font-semibold">{timeAgo(listing.createdAt)}</p>
            </div>
          </div>
        )}
        {listing.status && (
          <div>
            <p className="text-xs text-ink-faint">Status</p>
            <p className="font-semibold capitalize">{listing.status} {listing.approvalStatus ? `/ ${listing.approvalStatus}` : ""}</p>
          </div>
        )}
      </div>

      {listing.description && (
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase text-ink-faint">Description</p>
          <p className="whitespace-pre-line text-sm text-ink-light">{listing.description}</p>
        </div>
      )}

      <div className="mb-5 rounded-tag border border-paper-line p-3 text-sm">
        <p className="mb-1 text-xs font-semibold uppercase text-ink-faint">Seller</p>
        <p className="font-semibold">{listing.seller?.name || "—"}</p>
        {listing.seller?.phone && (
          <p className="flex items-center gap-1 text-ink-faint">
            <Phone size={12} /> {listing.seller.phone}
          </p>
        )}
        {listing.seller?.email && (
          <p className="flex items-center gap-1 text-ink-faint">
            <Mail size={12} /> {listing.seller.email}
          </p>
        )}
      </div>
    </>
  );
}

function PendingDetailModal({ listing, onClose, onApprove, onReject }) {
  if (!listing) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className={`relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-tag bg-white shadow-cardHover ${NO_SCROLLBAR}`}>
        <div className="flex items-center justify-between border-b border-paper-line px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">
            {listing.brand} {listing.model} {listing.variant}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-faint hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <ListingDetailBody listing={listing} />

          <div className="flex gap-2 border-t border-paper-line pt-4">
            <button onClick={() => onApprove(listing)} className="btn-primary flex-1 !py-2 text-sm">
              <Check size={15} /> Approve
            </button>
            <button onClick={() => onReject(listing)} className="btn-ghost flex-1 border border-paper-line !py-2 text-sm text-alert">
              <X size={15} /> Reject
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ListingViewModal({ listing, onClose, onDelete }) {
  if (!listing) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className={`relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-tag bg-white shadow-cardHover ${NO_SCROLLBAR}`}>
        <div className="flex items-center justify-between border-b border-paper-line px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">
            {listing.brand} {listing.model} {listing.variant}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-faint hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <ListingDetailBody listing={listing} />

          <div className="flex border-t border-paper-line pt-4">
            <button
              onClick={() => onDelete(listing)}
              className="btn-ghost w-full border border-paper-line !py-2 text-sm text-alert"
            >
              <Trash2 size={15} /> Delete Listing
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function WantedDetailModal({ request, onClose, onDelete }) {
  if (!request) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className={`relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-tag bg-white shadow-cardHover ${NO_SCROLLBAR}`}>
        <div className="flex items-center justify-between border-b border-paper-line px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">{request.title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-faint hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Wallet size={13} className="text-ink-faint" />
              <div>
                <p className="text-xs text-ink-faint">Budget Range</p>
                <p className="font-bold text-bazaar-600">
                  {formatPKR(request.minBudget)} – {formatPKR(request.maxBudget)}
                </p>
              </div>
            </div>
            {request.location && (
              <div className="flex items-center gap-1">
                <MapPin size={13} className="text-ink-faint" />
                <div>
                  <p className="text-xs text-ink-faint">Location</p>
                  <p className="font-semibold">{request.location}</p>
                </div>
              </div>
            )}
            {request.condition && (
              <div>
                <p className="text-xs text-ink-faint">Preferred Condition</p>
                <p className="font-semibold capitalize">{request.condition}</p>
              </div>
            )}
            {request.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar size={13} className="text-ink-faint" />
                <div>
                  <p className="text-xs text-ink-faint">Posted</p>
                  <p className="font-semibold">{timeAgo(request.createdAt)}</p>
                </div>
              </div>
            )}
          </div>

          {request.description && (
            <div className="mb-4">
              <p className="mb-1 text-xs font-semibold uppercase text-ink-faint">Description</p>
              <p className="whitespace-pre-line text-sm text-ink-light">{request.description}</p>
            </div>
          )}

          <div className="mb-5 rounded-tag border border-paper-line p-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase text-ink-faint">Buyer</p>
            <p className="font-semibold">{request.buyer?.name || "—"}</p>
            {request.buyer?.phone && (
              <p className="flex items-center gap-1 text-ink-faint">
                <Phone size={12} /> {request.buyer.phone}
              </p>
            )}
            {request.buyer?.email && (
              <p className="flex items-center gap-1 text-ink-faint">
                <Mail size={12} /> {request.buyer.email}
              </p>
            )}
          </div>

          <div className="flex border-t border-paper-line pt-4">
            <button
              onClick={() => onDelete(request)}
              className="btn-ghost w-full border border-paper-line !py-2 text-sm text-alert"
            >
              <Trash2 size={15} /> Delete Request
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function UserDetailModal({ user, onClose, onToggleSuspend }) {
  if (!user) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className={`relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-tag bg-white shadow-cardHover ${NO_SCROLLBAR}`}>
        <div className="flex items-center justify-between border-b border-paper-line px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-bazaar-100 text-lg font-bold text-bazaar-700">
              {user.avatar ? (
                <img src={resolveImageUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name?.charAt(0) || <UserCircle size={22} />
              )}
            </div>
            <h2 className="font-display text-lg font-bold text-ink">{user.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-ink-faint hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-ink-faint">Role</p>
              <p className="font-semibold capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Status</p>
              <p className={`font-semibold ${user.isSuspended ? "text-alert" : "text-bazaar-600"}`}>
                {user.isSuspended ? "Suspended" : "Active"}
              </p>
            </div>
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin size={13} className="text-ink-faint" />
                <div>
                  <p className="text-xs text-ink-faint">Location</p>
                  <p className="font-semibold">{user.location}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-xs text-ink-faint">Total Listings</p>
              <p className="font-semibold">{user.listingCount ?? 0}</p>
            </div>
            {user.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar size={13} className="text-ink-faint" />
                <div>
                  <p className="text-xs text-ink-faint">Joined</p>
                  <p className="font-semibold">{timeAgo(user.createdAt)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mb-5 rounded-tag border border-paper-line p-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase text-ink-faint">Contact</p>
            {user.email && (
              <p className="flex items-center gap-1 text-ink-faint">
                <Mail size={12} /> {user.email}
              </p>
            )}
            {user.phone && (
              <p className="mt-0.5 flex items-center gap-1 text-ink-faint">
                <Phone size={12} /> {user.phone}
              </p>
            )}
            {!user.email && !user.phone && <p className="text-ink-faint">No contact info available.</p>}
          </div>

          {user.role !== "admin" && (
            <div className="flex border-t border-paper-line pt-4">
              <button
                onClick={() => onToggleSuspend(user)}
                className={`btn w-full !py-2 text-sm ${
                  user.isSuspended
                    ? "btn-secondary"
                    : "btn-ghost border border-paper-line text-alert"
                }`}
              >
                <Ban size={15} /> {user.isSuspended ? "Unsuspend User" : "Suspend User"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [pending, setPending] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [wanted, setWanted] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingListing, setViewingListing] = useState(null);
  const [viewingFullListing, setViewingFullListing] = useState(null);
  const [viewingWanted, setViewingWanted] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (viewingListing || viewingFullListing || viewingWanted || viewingUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewingListing, viewingFullListing, viewingWanted, viewingUser]);

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      adminApi.stats(),
      adminApi.listings(),
      adminApi.listings({ approvalStatus: "pending" }),
      adminApi.reports(),
      adminApi.users(),
      adminApi.wanted(),
       adminApi.contactMessages(),
    ])
      .then(([s, l, p, r, u, w, cm]) => {
        setStats(s);
        setListings(l.items);
        setPending(p.items);
        setReports(r.items);
        setUsers(u.items);
        setWanted(w.items);
        setContactMessages(cm.items);
      })
      .catch((err) => showToast(err.message, "warning"))
      .finally(() => setLoading(false));
  };

  useEffect(loadAll, []);

  const act = async (fn, successMsg) => {
    try {
      await fn();
      showToast(successMsg, "success");
      loadAll();
    } catch (err) {
      showToast(err.message, "warning");
    }
  };

  const handleApprove = (p) => {
    setViewingListing(null);
    act(() => adminApi.approveListing(p._id), `Approved "${p.model}".`);
  };

  const handleReject = (p) => {
    setViewingListing(null);
    act(() => adminApi.rejectListing(p._id), `Rejected "${p.model}".`);
  };

  const handleDeleteFullListing = (m) => {
    setViewingFullListing(null);
    act(() => adminApi.deleteListing(m._id), `Deleted "${m.model}" listing.`);
  };

  const handleDeleteWanted = (w) => {
    setViewingWanted(null);
    act(() => adminApi.deleteWanted(w._id), `Deleted "${w.title}" request.`);
  };

  const handleToggleSuspend = (u) => {
    setViewingUser(null);
    act(
      () => adminApi.toggleSuspend(u.id),
      u.isSuspended ? `Unsuspended ${u.name}.` : `Suspended ${u.name}.`
    );
  };

  const STATS_DISPLAY = stats
    ? [
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-bazaar-50 text-bazaar-600", tab: "Users" },
          { label: "Active Listings", value: stats.activeListings, icon: ListChecks, color: "bg-bazaar-50 text-bazaar-600", tab: "Listings" },
          { label: "Sold Phones", value: stats.soldPhones, icon: BadgeCheck, color: "bg-tag-light text-tag-dark", tab: "Listings" },
          { label: "Wanted Requests", value: stats.wantedRequests, icon: MessageSquareText, color: "bg-bazaar-50 text-bazaar-600", tab: "Wanted Requests" },
          { label: "Pending Listings", value: stats.pendingListings, icon: Clock, color: "bg-tag-light text-tag-dark", tab: "Pending" },
          { label: "Reports", value: stats.openReports, icon: Flag, color: "bg-alert-light text-alert", tab: "Reports" },
      ]
    : [];

  return (
    <div className="container-page py-8">
      <div className="mb-1 flex items-center gap-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        <ShieldCheck size={20} className="text-bazaar-600" />
      </div>
      <p className="mt-1 mb-6 text-sm text-ink-faint">
        Manage listings, users, and reports across Johi Mobile Mart.
      </p>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-paper-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold ${
              tab === t ? "border-bazaar-500 text-bazaar-600" : "border-transparent text-ink-faint hover:text-ink"
            }`}
          >
            {t}
            {t === "Pending" && pending.length > 0 && (
              <span className="ml-1.5 rounded-full bg-tag px-1.5 py-0.5 text-[10px] font-bold text-white">
                {pending.length}
              </span>
            )}
            {t === "Reports" && reports.length > 0 && (
              <span className="ml-1.5 rounded-full bg-alert px-1.5 py-0.5 text-[10px] font-bold text-white">
                {reports.length}
              </span>
            )}
            {t === "Contact Messages" && contactMessages.length > 0 && (
              <span className="ml-1.5 rounded-full bg-alert px-1.5 py-0.5 text-[10px] font-bold text-white">
                {contactMessages.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState count={6} />
      ) : (
        <>
          {tab === "Overview" && (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
    {STATS_DISPLAY.map((s) => (
      <button
        key={s.label}
        onClick={() => setTab(s.tab)}
        className="card-surface p-4 text-left cursor-pointer hover:border-bazaar-300 transition-colors"
      >
        <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${s.color}`}>
          <s.icon size={17} />
        </div>
        <p className="text-2xl font-extrabold text-ink">{s.value}</p>
        <p className="text-xs text-ink-faint">{s.label}</p>
      </button>
    ))}
  </div>
)}

          {tab === "Listings" && (
            listings.length === 0 ? (
              <EmptyState title="No listings yet" message="Listings will appear here once sellers publish them." />
            ) : (
              <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-paper-line text-left text-xs uppercase text-ink-faint">
                    <tr>
                      <th className="px-4 py-3">Listing</th>
                      <th className="px-4 py-3">Seller</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Posted</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((m) => (
                      <tr key={m._id} className="border-b border-paper-line last:border-0">
                        <td className="px-4 py-3 font-medium">{m.model} {m.variant}</td>
                        <td className="px-4 py-3 text-ink-faint">{m.seller?.name}</td>
                        <td className="px-4 py-3">{formatPKR(m.price)}</td>
                        <td className="px-4 py-3 capitalize">{m.status} / {m.approvalStatus}</td>
                        <td className="px-4 py-3 text-ink-faint">{timeAgo(m.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setViewingFullListing(m)}
                              className="flex items-center gap-1 text-xs font-semibold text-bazaar-600"
                            >
                              <Eye size={13} /> View
                            </button>
                            <button
                              onClick={() => act(() => adminApi.deleteListing(m._id), `Deleted "${m.model}" listing.`)}
                              className="flex items-center gap-1 text-xs font-semibold text-alert"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {tab === "Pending" && (
            pending.length === 0 ? (
              <EmptyState title="Nothing pending" message="New listings needing approval will show up here." />
            ) : (
              <div className="space-y-3">
                {pending.map((p) => (
                  <div key={p._id} className="card-surface flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img
                          src={resolveImageUrl(p.images[0])}
                          alt={p.model}
                          className="h-14 w-14 shrink-0 rounded-md object-cover border border-paper-line"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-paper text-ink-faint">
                          <ImageOff size={18} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{p.brand} {p.model} {p.variant}</p>
                        <p className="text-xs text-ink-faint">
                          by {p.seller?.name} • {formatPKR(p.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingListing(p)}
                        className="btn-secondary !px-3 !py-1.5 text-xs"
                      >
                        <Eye size={13} /> View Details
                      </button>
                      <button
                        onClick={() => act(() => adminApi.approveListing(p._id), `Approved "${p.model}".`)}
                        className="btn-primary !px-3 !py-1.5 text-xs"
                      >
                        <Check size={13} /> Approve
                      </button>
                      <button
                        onClick={() => act(() => adminApi.rejectListing(p._id), `Rejected "${p.model}".`)}
                        className="btn-ghost border border-paper-line !px-3 !py-1.5 text-xs text-alert"
                      >
                        <X size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "Reports" && (
            reports.length === 0 ? (
              <EmptyState title="No open reports" message="Reported listings will appear here for review." />
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r._id} className="card-surface flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-bold">
                        {r.listing ? `${r.listing.brand} ${r.listing.model}` : "Listing removed"}
                      </p>
                      <p className="text-xs text-alert">Reason: {r.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      {r.listing && (
                        <button
                          onClick={() => act(() => adminApi.deleteListing(r.listing._id), "Listing removed after review.")}
                          className="btn-ghost border border-paper-line !px-3 !py-1.5 text-xs text-alert"
                        >
                          <Trash2 size={13} /> Remove Listing
                        </button>
                      )}
                      <button
                        onClick={() => act(() => adminApi.resolveReport(r._id), "Report resolved.")}
                        className="btn-secondary !px-3 !py-1.5 text-xs"
                      >
                        <Check size={13} /> Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "Users" && (
            <div className="card-surface overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-paper-line text-left text-xs uppercase text-ink-faint">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Listings</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-paper-line last:border-0">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-ink-faint">{u.location}</td>
                      <td className="px-4 py-3 capitalize">{u.role}</td>
                      <td className="px-4 py-3">{u.listingCount}</td>
                      <td className="px-4 py-3">
                        {u.isSuspended ? (
                          <span className="font-semibold text-alert">Suspended</span>
                        ) : (
                          <span className="font-semibold text-bazaar-600">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setViewingUser(u)}
                            className="flex items-center gap-1 text-xs font-semibold text-bazaar-600"
                          >
                            <Eye size={13} /> View
                          </button>
                          {u.role !== "admin" && (
                            <button
                              onClick={() =>
                                act(
                                  () => adminApi.toggleSuspend(u.id),
                                  u.isSuspended ? `Unsuspended ${u.name}.` : `Suspended ${u.name}.`
                                )
                              }
                              className={`flex items-center gap-1 text-xs font-semibold ${
                                u.isSuspended ? "text-bazaar-600" : "text-alert"
                              }`}
                            >
                              <Ban size={13} /> {u.isSuspended ? "Unsuspend" : "Suspend"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Wanted Requests" && (
            wanted.length === 0 ? (
              <EmptyState title="No wanted requests" message="Buyer requests will appear here." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wanted.map((w) => (
                  <div key={w._id} className="card-surface flex flex-col p-4">
                    <p className="font-bold">{w.title}</p>
                    <p className="text-sm text-bazaar-600 font-semibold">
                      {formatPKR(w.minBudget)} – {formatPKR(w.maxBudget)}
                    </p>
                    <p className="mt-1 text-xs text-ink-faint">
                      by {w.buyer?.name} • {w.location}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setViewingWanted(w)}
                        className="btn-secondary !px-3 !py-1.5 text-xs"
                      >
                        <Eye size={13} /> View Details
                      </button>
                      <button
                        onClick={() => act(() => adminApi.deleteWanted(w._id), `Deleted "${w.title}" request.`)}
                        className="flex items-center gap-1 text-xs font-semibold text-alert"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "Contact Messages" && (
            contactMessages.length === 0 ? (
              <EmptyState title="No messages" message="Contact form submissions will appear here." />
            ) : (
              <div className="space-y-3">
                {contactMessages.map((m) => (
                  <div key={m._id} className="card-surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{m.name}</p>
                        <p className="flex items-center gap-1 text-xs text-ink-faint">
                          <Mail size={12} /> {m.email} • {timeAgo(m.createdAt)}
                        </p>
                        {m.phone && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
                            <Phone size={12} /> {m.phone}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => act(() => adminApi.resolveContactMessage(m._id), "Message resolved.")}
                        className="btn-secondary !px-3 !py-1.5 text-xs shrink-0"
                      >
                        <Check size={13} /> Resolve
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-ink-light">{m.message}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      <PendingDetailModal
        listing={viewingListing}
        onClose={() => setViewingListing(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ListingViewModal
        listing={viewingFullListing}
        onClose={() => setViewingFullListing(null)}
        onDelete={handleDeleteFullListing}
      />

      <WantedDetailModal
        request={viewingWanted}
        onClose={() => setViewingWanted(null)}
        onDelete={handleDeleteWanted}
      />

      <UserDetailModal
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onToggleSuspend={handleToggleSuspend}
      />
    </div>
  );
}