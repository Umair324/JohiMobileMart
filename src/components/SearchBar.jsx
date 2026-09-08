import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { listingsApi } from "../api/listings";

export default function SearchBar({
  size = "md",
  placeholder,
  initialValue = "",
  clearAfterSearch = true,
}) {
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 👇 Naya: agar parent se initialValue change ho (URL/filters ki wajah se),
  // to search box ka text bhi sync ho jaye
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = await listingsApi.browse({ q: query, limit: 5 });
        if (!cancelled) setSuggestions(data.items || []);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const runSearch = (text) => {
    setFocused(false);
    setSuggestions([]);
    navigate(`/mobiles?q=${encodeURIComponent(text)}`);
    setQuery(clearAfterSearch ? "" : text);
  };

  const submit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleSuggestionClick = (s) => {
    const searchText = `${s.brand} ${s.model} ${s.variant}`.trim();
    runSearch(searchText);
  };

  const sizeClasses = size === "lg" ? "py-4 text-base" : "py-2.5 text-sm";

  return (
    <form onSubmit={submit} className="relative w-full">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder || "Search by brand, model or keyword..."}
          className={`w-full rounded-tag border border-paper-line bg-white pl-11 pr-28 ${sizeClasses} text-ink placeholder:text-ink-faint focus:border-bazaar-400 focus:ring-2 focus:ring-bazaar-100 outline-none shadow-sm`}
          aria-label="Search mobile phones"
        />
        <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-tag bg-bazaar-500 px-4 py-2 text-sm font-semibold text-white hover:bg-bazaar-600">
          Search
        </button>
      </div>

      {focused && query.trim() && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-tag border border-paper-line bg-white shadow-cardHover">
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-ink-faint">
              <Loader2 size={14} className="animate-spin" /> Searching...
            </div>
          ) : suggestions.length ? (
            suggestions.map((s) => (
              <button
                type="button"
                key={s._id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionClick(s)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-paper"
              >
                <span className="font-medium text-ink">
                  {s.brand} {s.model} {s.variant}
                </span>
                <span className="text-ink-faint">{s.location}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-ink-faint">No matching phones yet.</div>
          )}
        </div>
      )}
    </form>
  );
}