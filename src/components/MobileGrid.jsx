import MobileCard from "./MobileCard";
import EmptyState from "./EmptyState";
import { SearchX } from "lucide-react";

export default function MobileGrid({ mobiles, emptyMessage }) {
  if (!mobiles.length) {
    return (
      <EmptyState
        icon={SearchX}
        title="No phones match your search"
        message={
          emptyMessage ||
          "Try widening your filters or searching a different brand or model."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {mobiles.map((m) => (
        <MobileCard key={m._id || m.id} mobile={m} />
      ))}
    </div>
  );
}
