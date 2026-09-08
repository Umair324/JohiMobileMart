import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import FormInput from "../components/FormInput";
import Select from "../components/Select";
import { brands, conditions, storageOptions, locations } from "../data/categories";
import { useToast } from "../components/Toast";
import { wantedApi } from "../api/misc";

export default function PostWantedRequest() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    minStorage: "",
    maxBudget: "",
    condition: "",
    ptaRequired: true,
    location: "Johi",
    phone: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await wantedApi.create({
        title: `Looking for ${form.brand} ${form.model}`,
        ...form,
      });
      setSubmitted(true);
      showToast("Your wanted request has been posted.", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message, "warning");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-page flex flex-col items-center py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-bazaar-50 text-bazaar-600">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Your wanted request is live!</h1>
        <p className="mt-2 max-w-md text-sm text-ink-faint">
          Sellers with a matching {form.brand || "phone"} {form.model} can now reach out to you directly.
        </p>
        <button className="btn-primary mt-7" onClick={() => navigate("/wanted-phones")}>View Wanted Phones</button>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">What phone are you looking for?</h1>
      <p className="mt-1 mb-8 text-sm text-ink-faint">Post your request and let sellers in Johi come to you.</p>

      {error && <div className="mb-4 rounded-tag bg-alert-light px-4 py-3 text-sm text-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Brand" required options={brands} value={form.brand} onChange={(e) => update("brand", e.target.value)} />
          <FormInput label="Model" required placeholder="e.g. iPhone 13" value={form.model} onChange={(e) => update("model", e.target.value)} />
          <Select label="Minimum Storage" options={storageOptions} value={form.minStorage} onChange={(e) => update("minStorage", e.target.value)} />
          <FormInput label="Maximum Budget (Rs.)" required type="number" placeholder="e.g. 140000" value={form.maxBudget} onChange={(e) => update("maxBudget", e.target.value)} />
          <Select label="Preferred Condition" options={conditions} value={form.condition} onChange={(e) => update("condition", e.target.value)} />
          <Select label="Location" required options={locations} value={form.location} onChange={(e) => update("location", e.target.value)} />
        </div>

        <FormInput label="Phone Number" required placeholder="03XX-XXXXXXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} />

        <label className="flex items-center gap-2 text-sm text-ink-light cursor-pointer">
          <input type="checkbox" checked={form.ptaRequired} onChange={(e) => update("ptaRequired", e.target.checked)} className="text-bazaar-500 focus:ring-bazaar-300" />
          PTA approved required
        </label>

        <div>
          <label className="label-field" htmlFor="description">Description</label>
          <textarea id="description" rows={4} className="input-field" placeholder="I am looking for iPhone 13 128GB PTA approved. Budget around Rs. 140,000." value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <p className="text-xs text-ink-faint">Sellers will see your phone number so they can reach out directly.</p>

        <button type="submit" disabled={submitting} className="btn-tag w-full">
          {submitting && <Loader2 size={16} className="animate-spin" />} Post Wanted Request
        </button>
      </form>
    </div>
  );
}