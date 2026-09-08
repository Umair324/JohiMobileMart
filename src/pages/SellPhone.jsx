import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import FormInput from "../components/FormInput";
import Select from "../components/Select";
import Badge from "../components/Badge";
import {
  brands,
  conditions,
  ptaOptions,
  storageOptions,
  ramOptions,
  simOptions,
  locations,
} from "../data/categories";
import { formatPKR } from "../utils/format";
import { useToast } from "../components/Toast";
import { listingsApi } from "../api/listings";

const STEPS = [
  "Phone Info",
  "Condition",
  "Accessories",
  "Images",
  "Price",
  "Location",
  "Seller Info",
  "Preview",
];

const ACCESSORY_OPTIONS = ["Original Box", "Original Charger", "Cable", "Warranty", "Receipt"];

const initialForm = {
  brand: "",
  model: "",
  variant: "",
  color: "",
  storage: "",
  ram: "",
  condition: "",
  batteryHealth: "90",
  pta: "",
  sim: "",
  accessories: [],
  price: "",
  priceType: "Negotiable",
  city: "Johi",
  area: "",
};

function Stepper({ step }) {
  return (
    <div className="mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex min-w-max items-center gap-1.5">
        {STEPS.map((label, i) => {
          const idx = i + 1;
          const isDone = idx < step;
          const isActive = idx === step;
          return (
            <div key={label} className="flex items-center gap-1.5">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isDone
                      ? "bg-bazaar-500 text-white"
                      : isActive
                      ? "border-2 border-bazaar-500 text-bazaar-600"
                      : "border border-paper-line text-ink-faint"
                  }`}
                >
                  {isDone ? <Check size={14} /> : idx}
                </div>
                <span
                  className={`text-[10px] font-semibold whitespace-nowrap ${
                    isActive ? "text-bazaar-600" : "text-ink-faint"
                  }`}
                >
                  {label}
                </span>
              </div>
              {idx !== STEPS.length && (
                <div className={`h-0.5 w-6 sm:w-10 ${isDone ? "bg-bazaar-500" : "bg-paper-line"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SellPhone() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleAccessory = (item) => {
    setForm((f) => ({
      ...f,
      accessories: f.accessories.includes(item)
        ? f.accessories.filter((a) => a !== item)
        : [...f.accessories, item],
    }));
  };

  const addImages = (fileList) => {
    const files = Array.from(fileList).slice(0, 8 - imageFiles.length);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImageFiles((prev) => [...prev, ...files].slice(0, 8));
    setImagePreviews((prev) => [...prev, ...previews].slice(0, 8));
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const canProceed = () => {
    switch (step) {
      case 1:
  return (
    form.brand &&
    form.model &&
    form.storage &&
    (form.brand === "Apple" || form.ram)
  );
      case 2:
        return form.condition && form.pta && form.sim;
      case 3:
        return true;
      case 4:
        return imageFiles.length >= 2;
      case 5:
        return form.price;
      case 6:
        return form.city && form.area;
      default:
        return true;
    }
  };

  const handlePublish = async () => {
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "accessories") value.forEach((a) => fd.append("accessories", a));
        else fd.append(key, value);
      });
      imageFiles.forEach((file) => fd.append("images", file));

      await listingsApi.create(fd);
      setPublished(true);
      showToast("Your mobile has been listed successfully!", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message, "warning");
    } finally {
      setSubmitting(false);
    }
  };

  if (published) {
    return (
      <div className="container-page flex flex-col items-center py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-bazaar-50 text-bazaar-600">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
          Your mobile has been listed successfully!
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink-faint">
          Buyers in {form.city} and nearby areas can now find your {form.brand} {form.model}.
          You'll get calls and WhatsApp messages directly.
        </p>
        <p className="mt-2 text-xs text-tag-dark font-medium">
          Your listing is pending a quick review by our team before it goes live in search results.
        </p>

        <div className="mt-7 flex gap-3">
          <button className="btn-secondary" onClick={() => navigate("/mobiles")}>
            Browse Listings
          </button>
          <button className="btn-primary" onClick={() => navigate("/dashboard")}>
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Sell Your Phone</h1>
      <p className="mt-1 mb-8 text-sm text-ink-faint">
        Fill in the details below — it takes less than 5 minutes.
      </p>

      <Stepper step={step} />

      {error && (
        <div className="mb-4 rounded-tag bg-alert-light px-4 py-3 text-sm text-alert">{error}</div>
      )}

      <div className="card-surface p-5 sm:p-7">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-bold">Phone Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Brand" required options={brands} value={form.brand} onChange={(e) => update("brand", e.target.value)} />
              <FormInput label="Model" required placeholder="e.g. iPhone 13" value={form.model} onChange={(e) => update("model", e.target.value)} />
              <FormInput label="Variant" placeholder="e.g. 128GB Pro" value={form.variant} onChange={(e) => update("variant", e.target.value)} />
              <FormInput label="Color" placeholder="e.g. Midnight" value={form.color} onChange={(e) => update("color", e.target.value)} />
              <Select label="Storage" required options={storageOptions} value={form.storage} onChange={(e) => update("storage", e.target.value)} />
             {form.brand !== "Apple" && (
              <Select label="RAM" required options={ramOptions} value={form.ram} onChange={(e) => update("ram", e.target.value)} />
             )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-bold">Condition</h2>
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
          </div> 
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-bold">Accessories Included</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ACCESSORY_OPTIONS.map((item) => (
                <label key={item} className={`flex items-center gap-2 rounded-tag border px-3.5 py-2.5 text-sm font-medium cursor-pointer ${form.accessories.includes(item) ? "border-bazaar-400 bg-bazaar-50 text-bazaar-700" : "border-paper-line text-ink-light"}`}>
                  <input type="checkbox" checked={form.accessories.includes(item)} onChange={() => toggleAccessory(item)} className="text-bazaar-500 focus:ring-bazaar-300" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-bold">Upload Images</h2>
            <p className="text-sm text-ink-faint">
              Minimum 2 images required. Recommended: front, back, side, screen, camera, accessories.
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-paper-line py-10 text-center hover:border-bazaar-300">
              <ImagePlus size={28} className="text-ink-faint" />
              <span className="text-sm font-semibold text-bazaar-600">Click to upload images</span>
              <span className="text-xs text-ink-faint">PNG, JPG or WEBP, up to 8 images</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && addImages(e.target.files)} />
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {imagePreviews.map((src, i) => (
                  <div key={src} className="relative">
                    <div className="aspect-square overflow-hidden rounded-tag border border-paper-line bg-paper">
                      <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                    <button onClick={() => removeImage(i)} aria-label={`Remove image ${i + 1}`} className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-alert text-white">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {imageFiles.length < 2 && (
              <p className="text-xs text-alert">Please add at least 2 images to continue.</p>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-bold">Set Your Price</h2>
            <FormInput label="Asking Price (Rs.)" required type="number" placeholder="e.g. 145000" value={form.price} onChange={(e) => update("price", e.target.value)} />
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
        )}

        {step === 6 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-bold">Location</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="City" required options={locations} value={form.city} onChange={(e) => update("city", e.target.value)} />
              <FormInput label="Area" required placeholder="e.g. Johi Bazaar, near GPO" value={form.area} onChange={(e) => update("area", e.target.value)} />
            </div>
            <p className="text-xs text-ink-faint">
              A precise map pin can be added later — for now, your area name helps buyers nearby find you.
            </p>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4 text-center py-4">
            <h2 className="font-display text-lg font-bold">You're logged in</h2>
            <p className="text-sm text-ink-faint max-w-sm mx-auto">
              Your listing will show your account name and contact details — the ones you
              registered with. No need to re-enter them here.
            </p>
          </div>
        )}

        {step === 8 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-bold">Preview Your Ad</h2>
            <p className="mb-4 text-sm text-ink-faint">
              This is exactly how buyers will see your listing.
            </p>
            <div className="mx-auto max-w-sm card-surface overflow-hidden">
              <div className="aspect-[4/3] bg-paper">
                {imagePreviews[0] ? (
                  <img src={imagePreviews[0]} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-faint text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold">
                  {form.model || "Model"} {form.variant}
                </h3>
                <p className="mt-0.5 text-lg font-extrabold text-bazaar-600">
                  {form.price ? formatPKR(form.price) : "Rs. —"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-ink-faint">
                  <span>{form.storage}</span>
                  {form.ram && (
                    <>
                      <span>•</span>
                      <span>{form.ram} RAM</span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.brand === "Apple" && <Badge variant="green">Battery {form.batteryHealth}%</Badge>}
                  {form.pta === "PTA Approved" && <Badge variant="amber">PTA</Badge>}
                </div>
                <p className="mt-3 border-t border-paper-line pt-2 text-xs text-ink-faint">
                  {form.area ? `${form.area}, ` : ""}
                  {form.city}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={back} disabled={step === 1} className="btn-secondary disabled:opacity-40">
          <ChevronLeft size={16} /> Back
        </button>

        {step < STEPS.length ? (
          <button onClick={next} disabled={!canProceed()} className="btn-primary">
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="btn-secondary">
              Edit
            </button>
            <button onClick={handlePublish} disabled={submitting} className="btn-tag">
              {submitting && <Loader2 size={16} className="animate-spin" />} Publish Ad
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
