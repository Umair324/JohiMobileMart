import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, Loader2 } from "lucide-react";
import FormInput from "../components/FormInput";
import Select from "../components/Select";
import { locations } from "../data/categories";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function CompleteProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    phone: "",
    whatsapp: "",
    sameWhatsapp: true,
    location: "Johi",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.completeProfile({
        phone: form.phone,
        whatsapp: form.sameWhatsapp ? form.phone : form.whatsapp,
        location: form.location,
      });
      setUser(data.user);
      showToast("Your profile is all set!", "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-tag bg-bazaar-500 text-white">
            <Smartphone size={22} />
          </span>
          <h1 className="text-2xl font-bold">One more step, {user?.name?.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-ink-faint">
            Buyers and sellers need a phone number to contact each other — add yours to finish setting up your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
          {error && (
            <div className="rounded-tag bg-alert-light px-3.5 py-2.5 text-sm text-alert">{error}</div>
          )}
          <FormInput
            label="Phone Number"
            required
            type="tel"
            placeholder="03XX-XXXXXXX"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-ink-light cursor-pointer">
            <input
              type="checkbox"
              checked={form.sameWhatsapp}
              onChange={(e) => update("sameWhatsapp", e.target.checked)}
              className="text-bazaar-500 focus:ring-bazaar-300"
            />
            My WhatsApp number is the same as my phone number
          </label>
          {!form.sameWhatsapp && (
            <FormInput
              label="WhatsApp Number"
              required
              type="tel"
              placeholder="03XX-XXXXXXX"
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
            />
          )}
          <Select
            label="Location"
            required
            options={locations}
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 size={16} className="animate-spin" />} Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}