export function formatPKR(amount) {
  if (amount === null || amount === undefined) return "—";
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

export function timeAgo(dateString) {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
}

export function whatsappLink(number, message) {
  const digits = String(number).replace(/[^0-9]/g, "");
  // Assume Pakistani local number starting with 0, convert to +92
  const normalized = digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  const text = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${text}`;
}

export function telLink(number) {
  return `tel:${String(number).replace(/[^0-9+]/g, "")}`;
}
