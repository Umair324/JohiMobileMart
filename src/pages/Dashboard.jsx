import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  List,
  Heart as HeartIcon,
  MessageSquareText,
  UserCircle,
  Trash2,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  Loader2,
  Pencil,
} from "lucide-react";
import { formatPKR, timeAgo } from "../utils/format";
import ListingImage from "../components/ListingImage";
import EmptyState from "../components/EmptyState";
import MobileGrid from "../components/MobileGrid";
import LoadingState from "../components/LoadingState";
import FormInput from "../components/FormInput";
import Select from "../components/Select";
import Modal from "../components/Modal";
import { locations } from "../data/categories";
import { useFavorites } from "../hooks/useFavorites";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { listingsApi } from "../api/listings";
import { wantedApi } from "../api/misc";
import { authApi } from "../api/auth";
import { resolveImageUrl } from "../api/client";

const TABS = [
  { id: "listings", label: "My Listings", icon: List },
  { id: "wanted", label: "Wanted Requests", icon: MessageSquareText },
  { id: "favorites", label: "Favorites", icon: HeartIcon },
  { id: "profile", label: "Profile", icon: UserCircle },
];

export default function Dashboard() {
  const [tab, setTab] = useState("listings");
  const [listingFilter, setListingFilter] = useState("active");
  const [myListings, setMyListings] = useState([]);
  const [myWanted, setMyWanted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soldConfirm, setSoldConfirm] = useState(null);
  const { favoriteListings } = useFavorites();
  const { showToast } = useToast();

  const loadListings = () => {
    setLoading(true);
    Promise.all([listingsApi.mine(), wantedApi.mine()])
      .then(([listingsData, wantedData]) => {
        setMyListings(listingsData.items);
        setMyWanted(wantedData.items);
      })
      .catch((err) => showToast(err.message, "warning"))
      .finally(() => setLoading(false));
  };

  useEffect(loadListings, []);

  const filteredListings = myListings.filter((m) => m.status === listingFilter);

  const confirmSold = async () => {
    try {
      await listingsApi.markSold(soldConfirm._id);
      showToast(`${soldConfirm.model} marked as sold.`, "success");
      loadListings();
    } catch (err) {
      showToast(err.message, "warning");
    }
    setSoldConfirm(null);
  };

  const renew = async (id) => {
    try {
      await listingsApi.renew(id);
      showToast("Listing renewed.", "success");
      loadListings();
    } catch (err) {
      showToast(err.message, "warning");
    }
  };

  const remove = async (id) => {
    try {
      await listingsApi.remove(id);
      showToast("Listing deleted.", "success");
      loadListings();
    } catch (err) {
      showToast(err.message, "warning");
    }
  };

  const removeWanted = async (id) => {
    try {
      await wantedApi.remove(id);
      showToast("Wanted request removed.", "success");
      loadListings();
    } catch (err) {
      showToast(err.message, "warning");
    }
  };

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">My Dashboard</h1>
        <Link to="/sell" className="btn-tag shrink-0">
          <PlusCircle size={17} /> Sell Your Phone
        </Link>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-paper-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-semibold ${
              tab === t.id
                ? "border-bazaar-500 text-bazaar-600"
                : "border-transparent text-ink-faint hover:text-ink"
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "listings" && (
        <div>
          <div className="mb-4 flex gap-2">
            {["active", "sold", "expired"].map((f) => (
              <button
                key={f}
                onClick={() => setListingFilter(f)}
                className={`rounded-tag border px-3.5 py-1.5 text-sm font-semibold capitalize ${
                  listingFilter === f
                    ? "border-bazaar-400 bg-bazaar-50 text-bazaar-700"
                    : "border-paper-line text-ink-faint"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingState count={3} />
          ) : filteredListings.length === 0 ? (
            <EmptyState
              title={`No ${listingFilter} listings`}
              message="Listings you post will show up here."
            />
          ) : (
            <div className="space-y-3">
              {filteredListings.map((m) => (
                <div key={m._id} className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-tag bg-paper">
                    <ListingImage image={m.images?.[0]} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-ink">
                      {m.model} {m.variant}
                    </p>
                    <p className="text-sm font-semibold text-bazaar-600">{formatPKR(m.price)}</p>
                    <p className="text-xs text-ink-faint">
                      {m.views} views • posted {timeAgo(m.createdAt)}
                      {m.approvalStatus === "pending" && (
                        <span className="ml-2 font-semibold text-tag-dark">Pending approval</span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/edit-listing/${m._id}`} className="btn-secondary !px-3 !py-1.5 text-xs">
                      <Pencil size={13} /> Edit
                    </Link>
                    {m.status === "active" && (
                      <button onClick={() => setSoldConfirm(m)} className="btn-tag !px-3 !py-1.5 text-xs">
                        <CheckCircle2 size={13} /> Mark as Sold
                      </button>
                    )}
                    {m.status !== "active" && (
                      <button onClick={() => renew(m._id)} className="btn-ghost border border-paper-line !px-3 !py-1.5 text-xs">
                        <RefreshCw size={13} /> Renew
                      </button>
                    )}
                    <button onClick={() => remove(m._id)} className="btn-ghost border border-paper-line !px-3 !py-1.5 text-xs text-alert">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "wanted" && (
        loading ? (
          <LoadingState count={2} />
        ) : myWanted.length === 0 ? (
          <EmptyState title="No wanted requests" message="Post a request for the phone you're looking for." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {myWanted.map((w) => (
              <div key={w._id} className="card-surface p-4">
                <p className="font-bold">{w.title}</p>
                <p className="text-sm text-bazaar-600 font-semibold">
                  {formatPKR(w.minBudget)} – {formatPKR(w.maxBudget)}
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  Posted {timeAgo(w.createdAt)} • {w.location}
                </p>
                <button
                  onClick={() => removeWanted(w._id)}
                  className="mt-2 flex items-center gap-1 text-xs font-semibold text-alert"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "favorites" && (
        favoriteListings.length === 0 ? (
          <EmptyState
            icon={HeartIcon}
            title="No favorites yet"
            message="Tap the heart icon on any listing to save it here."
          />
        ) : (
          <MobileGrid mobiles={favoriteListings} />
        )
      )}

      {tab === "profile" && <ProfileForm />}

      <Modal
        open={!!soldConfirm}
        onClose={() => setSoldConfirm(null)}
        title="Mark as Sold?"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSoldConfirm(null)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={confirmSold}>
              Yes, Mark as Sold
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-light">
          This will hide "{soldConfirm?.model}" from search results and show a SOLD
          badge on the listing.
        </p>
      </Modal>
    </div>
  );
}

function ProfileForm() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    whatsapp: user?.whatsapp || "",
    location: user?.location || "Johi",
  });
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("whatsapp", form.whatsapp);
      fd.append("location", form.location);
      if (avatarFile) fd.append("avatar", avatarFile);

      const data = await authApi.updateProfile(fd);
      // Handles both possible response shapes: { user: {...} } or the user
      // object returned directly. Log `data` once if avatar still doesn't
      // update after this, to confirm which shape your API actually sends.
      const updatedUser = data.user ?? data;
      setUser(updatedUser);
      setAvatarPreview(updatedUser?.avatar || null);
      setAvatarFile(null);
      showToast("Profile updated successfully.", "success");
    } catch (err) {
      showToast(err.message, "warning");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="card-surface max-w-lg space-y-4 p-6">
      <div className="mb-2 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-bazaar-100 text-2xl font-bold text-bazaar-700">
          {avatarPreview ? (
            <img
              src={avatarPreview.startsWith("blob:") ? avatarPreview : resolveImageUrl(avatarPreview)}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            form.name.charAt(0)
          )}
        </div>
        <label className="btn-secondary !py-1.5 text-xs cursor-pointer">
          Change Photo
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>
      <FormInput label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
      <FormInput label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} disabled />
      <FormInput label="WhatsApp" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
      <Select label="Location" options={locations} value={form.location} onChange={(e) => update("location", e.target.value)} />
      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving && <Loader2 size={16} className="animate-spin" />} Save Changes
      </button>
    </form>
  );
}