import { useState } from "react";
import { Mail, MapPin, Loader2, Send } from "lucide-react";
import FormInput from "../components/FormInput";
import { useToast } from "../components/Toast";
import { contactApi } from "../api/misc";

function WhatsAppIcon({ size = 15, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Z" />
      <path d="M8.4 7.6c-.2-.45-.42-.46-.6-.47h-.5c-.18 0-.46.07-.7.34-.24.27-.92.9-.92 2.18s.94 2.53 1.07 2.7c.13.18 1.83 2.8 4.4 3.92 2.18.94 2.62.76 3.1.71.48-.05 1.53-.62 1.75-1.22.22-.6.22-1.11.15-1.22-.07-.11-.25-.18-.5-.31-.27-.13-1.53-.75-1.77-.84-.24-.09-.42-.13-.6.14-.18.27-.68.84-.83 1.01-.15.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.34-.8-.71-1.34-1.6-1.5-1.87-.15-.27-.02-.42.12-.55.13-.13.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.13-.6-1.51-.85-2.06Z" />
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.send(form);
      showToast("Your message has been sent. We'll get back to you soon.", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      showToast(err.message || "Failed to send message.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page max-w-5xl py-12">
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mt-2 text-ink-faint">
          Questions, feedback or a partnership idea? Reach out and we'll get back to you soon.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-paper-line bg-white shadow-sm">
        <div className="grid md:grid-cols-5">
          <div className="relative flex flex-col justify-between bg-bazaar-400 p-8 text-white md:col-span-2">
            <div>
              <h2 className="text-lg font-bold">Get in touch</h2>
              <p className="mt-2 text-sm text-bazaar-50/90">
                Our team typically replies within one business day.
              </p>
            </div>

            <div className="mt-10 space-y-5">
              <a href="mailto:johimobilemart.pk@gmail.com" className="flex items-start gap-3 text-sm text-bazaar-50/90 transition-colors hover:text-white">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Mail size={15} />
                </span>
                <span className="pt-1.5">johimobilemart.pk@gmail.com</span>
              </a>

              <a
                href="https://wa.me/923263622397"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-bazaar-50/90 transition-colors hover:text-white"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <WhatsAppIcon size={15} />
                </span>
                <span className="pt-1.5">0326 3622397</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-bazaar-50/90">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <MapPin size={15} />
                </span>
                <span className="pt-1.5">Johi, Sindh, Pakistan</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-8 md:col-span-3">
            <FormInput
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <FormInput
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <div>
              <label className="label-field" htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={6}
                required
                className="input-field"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Send size={15} />
                  <span>Send message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}