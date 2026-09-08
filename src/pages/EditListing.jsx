import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import FormInput from "../components/FormInput";
import Select from "../components/Select";
import ListingImage from "../components/ListingImage";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import {
  brands,
  conditions,
  ptaOptions,
  storageOptions,
  ramOptions,
  simOptions,
  locations,
} from "../data/categories";
import { listingsApi } from "../api/listings";
import { useToast } from "../components/Toast";

const ACCESSORY_OPTIONS = ["Original Box", "Original Charger", "Cable", "Warranty", "Receipt"];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    listingsApi
      .detail(id)
      .then((data) => {
        const m = data.listing;
        setForm({
          brand: m.brand,
          model: m.model,
          variant: m.variant || "",
          color: m.color || "",
          storage: m.storage,
          ram: m.ram || "",
          condition: m.condition,
          batteryHealth: m.batteryHealth,
          pta: m.pta,
          sim: m.sim,
          accessories: m.accessories || [],
          price: m.price,
          priceType: m.priceType,
          location: m.location,
          area: m.area || "",
          purchaseYear: m.purchaseYear || "",
          boxAvailable: !!m.boxAvailable,
          chargerAvailable: !!m.chargerAvailable,
          repairHistory: m.repairHistory || "",
          description: m.description || "",
          images: m.images || [],
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleAccessory = (item) => {
    setForm((f) => ({
      ...f,
      accessories: f.accessories.includes(item)
        ? f.accessories.filter((a) => a !== item)
        : [...f.accessories, item],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await listingsApi.update(id, {
        brand: form.brand,
        model: form.model,
        variant: form.variant,
        color: form.color,
        storage: form.storage,
        ram: form.ram,
        condition: form.condition,
        batteryHealth: Number(form.batteryHealth),
        pta: form.pta,
        sim: form.sim,
        accessories: form.accessories,
        price: Number(form.price),
        priceType: form.priceType,
        location: form.location,
        area: form.area,
        purchaseYear: form.purchaseYear ? Number(form.purchaseYear) : undefined,
        boxAvailable: form.boxAvailable,
        chargerAvailable: form.chargerAvailable,
        repairHistory: form.repairHistory,
        description: form.description,
      });
      showToast("Listing updated successfully.", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message, "warning");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page py-8">
        <LoadingState count={2} />
      </div>
    );
  }

  if (notFound || !form) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Listing not found"
          message="This listing may have been removed, or you don't have permission to edit it."
        />
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Edit Listing</h1>
      <p className="mt-1 mb-6 text-sm text-ink-faint">
        Update any details on your listing below.
      </p>

      {form.images.length > 0 && (
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {form.images.map((img, i) => (
            <div key={i} className="h-20 w-24 shrink-0 overflow-hidden rounded-tag border border-paper-line bg-paper">
              <ListingImage image={img} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
      <p className="mb-6 text-xs text-ink-faint">
        Photos can't be changed from here yet — delete and re-post the listing if you need to update images.
      </p>

      <form onSubmit={handleSave} className="card-surface space-y-6 p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Brand" required options={brands} value={form.brand} onChange={(e) => update("brand", e.target.value)} />
          <FormInput label="Model" required value={form.model} onChange={(e) => update("model", e.target.value)} />
          <FormInput label="Variant" value={form.variant} onChange={(e) => update("variant", e.target.value)} />
          <FormInput label="Color" value={form.color} onChange={(e) => update("color", e.target.value)} />
          <Select label="Storage" required options={storageOptions} value={form.storage} onChange={(e) => update("storage", e.target.value)} />
          {form.brand !== "Apple" && (
            <Select label="RAM" required options={ramOptions} value={form.ram} onChange={(e) => update("ram", e.target.value)} />
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Condition" required options={conditions} value={form.condition} onChange={(e) => update("condition", e.target.value)} />
          {form.brand === "Apple" && (
            <div>
              <label className="label-field">Battery Health: {form.batteryHealth}%</label>
              <input type="range" min="0" max="100" value={form.batteryHealth} onChange={(e) => update("batteryHealth", e.target.value)} className="w-full accent-bazaar-500" />
            </div>
          )}
          <Select label="PTA Status" required options={ptaOptions} value={form.pta} onChange={(e) => update("pta", e.target.value)} />
          <Select label="SIM" required options={simOptions} value={form.sim} onChange={(e) => update("sim", e.target.value)} />
        </div>

        <div>
          <label className="label-field">Accessories Included</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ACCESSORY_OPTIONS.map((item) => (
              <label key={item} className={`flex items-center gap-2 rounded-tag border px-3.5 py-2.5 text-sm font-medium cursor-pointer ${form.accessories.includes(item) ? "border-bazaar-400 bg-bazaar-50 text-bazaar-700" : "border-paper-line text-ink-light"}`}>
                <input type="checkbox" checked={form.accessories.includes(item)} onChange={() => toggleAccessory(item)} className="text-bazaar-500 focus:ring-bazaar-300" />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Asking Price (Rs.)" required type="number" value={form.price} onChange={(e) => update("price", e.target.value)} />
          <div>
            <label className="label-field">Price Type</label>
            <div className="flex gap-3">
              {["Fixed Price", "Negotiable"].map((type) => (
                <label key={type} className={`flex-1 cursor-pointer rounded-tag border px-4 py-2.5 text-center text-sm font-semibold ${form.priceType === type ? "border-bazaar-400 bg-bazaar-50 text-bazaar-700" : "border-paper-line text-ink-light"}`}>
                  <input type="radio" name="priceType" className="hidden" checked={form.priceType === type} onChange={() => update("priceType", type)} />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="City" required options={locations} value={form.location} onChange={(e) => update("location", e.target.value)} />
          <FormInput label="Area" required value={form.area} onChange={(e) => update("area", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Purchase Year" type="number" value={form.purchaseYear} onChange={(e) => update("purchaseYear", e.target.value)} />
          <FormInput label="Repair History" value={form.repairHistory} onChange={(e) => update("repairHistory", e.target.value)} placeholder="e.g. None" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-light cursor-pointer">
            <input type="checkbox" checked={form.boxAvailable} onChange={(e) => update("boxAvailable", e.target.checked)} className="text-bazaar-500 focus:ring-bazaar-300" />
            Box Available
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-light cursor-pointer">
            <input type="checkbox" checked={form.chargerAvailable} onChange={(e) => update("chargerAvailable", e.target.checked)} className="text-bazaar-500 focus:ring-bazaar-300" />
            Charger Available
          </label>
        </div>

        <div>
          <label className="label-field" htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            className="input-field"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate("/dashboard")} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}