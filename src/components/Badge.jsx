const VARIANTS = {
  green: "bg-bazaar-50 text-bazaar-700 border-bazaar-100",
  amber: "bg-tag-light text-tag-dark border-tag-light",
  ink: "bg-paper text-ink-light border-paper-line",
  red: "bg-alert-light text-alert border-alert-light",
};

export default function Badge({ children, variant = "green", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-tag border px-2 py-0.5 text-xs font-semibold ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
