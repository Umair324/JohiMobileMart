import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/mobiles?brand=${encodeURIComponent(category.name)}`}
      className="flex flex-col items-center gap-2 rounded-card border border-paper-line bg-white px-3 py-4 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-bazaar-300 hover:shadow-cardHover"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bazaar-50 text-xl">
        {category.emoji}
      </span>
      <span className="text-xs font-semibold text-ink-light sm:text-sm">
        {category.name}
      </span>
    </Link>
  );
}
