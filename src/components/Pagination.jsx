import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn-ghost h-9 w-9 rounded-tag p-0 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-9 w-9 rounded-tag text-sm font-semibold transition-colors ${
            p === page
              ? "bg-bazaar-500 text-white"
              : "text-ink-light hover:bg-paper"
          }`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="btn-ghost h-9 w-9 rounded-tag p-0 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
