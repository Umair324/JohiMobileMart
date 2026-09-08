import { Link } from "react-router-dom";
import { HeartOff } from "lucide-react";
import MobileGrid from "../components/MobileGrid";
import EmptyState from "../components/EmptyState";
import { useFavorites } from "../hooks/useFavorites";

export default function Favorites() {
  const { favoriteListings } = useFavorites();

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">My Favorites</h1>
      <p className="mt-1 mb-6 text-sm text-ink-faint">
        Phones you've saved for later.
      </p>

      {favoriteListings.length === 0 ? (
        <EmptyState
          icon={HeartOff}
          title="No favorites yet"
          message="Tap the heart icon on any listing to save it here."
          action={
            <Link to="/mobiles" className="btn-primary">
              Browse Mobiles
            </Link>
          }
        />
      ) : (
        <MobileGrid mobiles={favoriteListings} />
      )}
    </div>
  );
}
