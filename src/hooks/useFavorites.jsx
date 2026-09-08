import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { listingsApi } from "../api/listings";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoriteListings, setFavoriteListings] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      setFavoriteListings([]);
      return;
    }
    try {
      const data = await listingsApi.favorites();
      setFavoriteListings(data.items);
      setFavoriteIds(new Set(data.items.map((l) => l._id)));
    } catch {
      // silently ignore — favorites are non-critical
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleFavorite = async (id) => {
    if (!user) {
      showToast("Please login to save favorites.", "info");
      return;
    }
    // optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      await listingsApi.toggleFavorite(id);
      refresh();
    } catch (err) {
      showToast(err.message, "warning");
      refresh();
    }
  };

  const isFavorite = (id) => favoriteIds.has(id);

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, favoriteListings, toggleFavorite, isFavorite, refresh }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
