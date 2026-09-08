import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import WantedPhoneCard from "../components/WantedPhoneCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { wantedApi } from "../api/misc";

export default function WantedPhones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    wantedApi
      .browse()
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Wanted Phones</h1>
          <p className="mt-1 text-sm text-ink-faint">
            Buyers in Johi and nearby areas looking for a specific phone. Sellers can
            find buyers even before listing.
          </p>
        </div>
        <Link to="/wanted-phones/new" className="btn-tag shrink-0">
          <PlusCircle size={17} /> Post Wanted Request
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-tag bg-alert-light px-4 py-3 text-sm text-alert">
          Couldn't load wanted requests: {error}
        </div>
      )}

      {loading ? (
        <LoadingState count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No wanted requests yet"
          message="Be the first to post what phone you're looking for."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w) => (
            <WantedPhoneCard key={w._id} wanted={w} />
          ))}
        </div>
      )}
    </div>
  );
}
