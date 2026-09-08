// A small library of deterministic, brand-tinted SVG phone illustrations.
// Used instead of stock photography so every listing has a distinct,
// license-free "photo" that still feels like a real handset.

const PALETTES = {
  apple: ["#1D1D1F", "#A8AAAD"],
  samsung: ["#5B4B8A", "#C9BEEA"],
  vivo: ["#1E5FA8", "#AFD4F5"],
  oppo: ["#0B7A5B", "#9FE3CB"],
  xiaomi: ["#E8611C", "#FBCBA6"],
  infinix: ["#1B4CA8", "#9FC1F0"],
  tecno: ["#2A5AA0", "#B9D0F0"],
  oneplus: ["#B3151A", "#F0AEB1"],
  pixel: ["#3C4043", "#AECBFA"],
  realme: ["#F2C200", "#FCE8A0"],
  default: ["#1F7A4D", "#A9D6B7"],
};

function paletteFor(key) {
  const base = key.split("-")[0];
  return PALETTES[base] || PALETTES.default;
}

export default function PhoneArt({ imageKey = "default-1", className = "", angle = 0 }) {
  const [dark, light] = paletteFor(imageKey);
  const seed = imageKey.split("-")[1] || "1";
  const camPos = seed === "2" ? 26 : seed === "3" ? 34 : 20;

  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="Phone listing illustration"
    >
      <rect width="240" height="240" fill={light} opacity="0.35" />
      <g transform={`rotate(${angle} 120 120)`}>
        <rect x="78" y="30" width="84" height="180" rx="16" fill={dark} />
        <rect x="84" y="42" width="72" height="150" rx="4" fill={light} opacity="0.9" />
        <rect x="104" y="34" width="32" height="6" rx="3" fill={light} opacity="0.6" />
        <circle cx={84 + camPos} cy="56" r="5" fill={dark} opacity="0.8" />
        <circle cx="120" cy="198" r="3" fill={light} opacity="0.7" />
      </g>
    </svg>
  );
}
