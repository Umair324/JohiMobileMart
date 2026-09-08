import { SearchX } from "lucide-react";

export default function EmptyState({
  icon: Icon = SearchX,
  title = "Nothing here yet",
  message = "Try adjusting your search or filters.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bazaar-50 text-bazaar-500">
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-faint">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
