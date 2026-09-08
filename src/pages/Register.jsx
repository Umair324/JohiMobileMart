import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Smartphone, Loader2 } from "lucide-react";
import FormInput from "../components/FormInput";
import Select from "../components/Select";
import { locations } from "../data/categories";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
    location: "Johi",
    sameWhatsapp: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const goAfterAuth = (user) => {
    navigate(user.needsProfileCompletion ? "/complete-profile" : "/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        phone: form.phone,
        whatsapp: form.sameWhatsapp ? form.phone : form.whatsapp,
        password: form.password,
        location: form.location,
      });
      showToast("Account created successfully!", "success");
      goAfterAuth(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const user = await loginWithGoogle(credentialResponse.credential, "signup");
      showToast(`Account created! Welcome, ${user.name.split(" ")[0]}!`, "success");
      goAfterAuth(user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-tag bg-bazaar-500 text-white">
            <Smartphone size={22} />
          </span>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-ink-faint">
            Join Johi Mobile Mart to buy and sell phones directly
          </p>
        </div>

        <div className="card-surface space-y-4 p-6">
          {error && (
            <div className="rounded-tag bg-alert-light px-3.5 py-2.5 text-sm text-alert">{error}</div>
          )}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed. Please try again.")}
              width="336"
              text="signup_with"
            />
          </div>
          <p className="text-center text-xs text-ink-faint">
            Signing up with Google still asks for your phone number afterward — buyers and sellers need it to connect.
          </p>

          <div className="flex items-center gap-3 text-xs text-ink-faint">
            <div className="h-px flex-1 bg-paper-line" />
            or sign up with phone
            <div className="h-px flex-1 bg-paper-line" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
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
            <Select label="Location" required options={locations} value={form.location} onChange={(e) => update("location", e.target.value)} />
            <FormInput label="Password" type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} />
            <FormInput label="Confirm Password" type="password" required value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading && <Loader2 size={16} className="animate-spin" />} Create Account
            </button>
          </form>

          <p className="text-center text-sm text-ink-faint">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-bazaar-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}