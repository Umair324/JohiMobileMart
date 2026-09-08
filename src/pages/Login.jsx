import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Smartphone, Loader2 } from "lucide-react";
import FormInput from "../components/FormInput";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "", remember: true });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const goAfterLogin = (user) => {
    const dest = user.needsProfileCompletion
      ? "/complete-profile"
      : location.state?.from?.pathname || "/dashboard";
    navigate(dest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.identifier, form.password);
      showToast("Logged in successfully. Welcome back!", "success");
      goAfterLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const user = await loginWithGoogle(credentialResponse.credential, "login");
      showToast(`Welcome back, ${user.name.split(" ")[0]}!`, "success");
      goAfterLogin(user);
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
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-faint">Login to manage your listings</p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
          {error && (
            <div className="rounded-tag bg-alert-light px-3.5 py-2.5 text-sm text-alert">{error}</div>
          )}
          <FormInput
            label="Phone / Email"
            required
            value={form.identifier}
            onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))}
            placeholder="03XX-XXXXXXX or email"
          />
          <FormInput
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-ink-light cursor-pointer">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
                className="text-bazaar-500 focus:ring-bazaar-300"
              />
              Remember me
            </label>
            <button type="button" className="font-semibold text-bazaar-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 size={16} className="animate-spin" />} Login
          </button>

          <div className="flex items-center gap-3 text-xs text-ink-faint">
            <div className="h-px flex-1 bg-paper-line" />
            or
            <div className="h-px flex-1 bg-paper-line" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed. Please try again.")}
              width="336"
            />
          </div>

          <p className="text-center text-sm text-ink-faint">
            New to Johi Mobile Mart?{" "}
            <Link to="/register" className="font-semibold text-bazaar-600 hover:underline">
              Create an account
            </Link>
          </p>

          {import.meta.env.DEV && (
            <p className="rounded-tag bg-paper px-3 py-2.5 text-center text-xs text-ink-faint">
              Demo admin: <strong>0300-0000000</strong> / <strong>admin123</strong>
              <br />
              Demo seller: <strong>0300-1234567</strong> / <strong>password123</strong>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}