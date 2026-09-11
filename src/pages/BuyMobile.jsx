import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import MobileGrid from "../components/MobileGrid";
import LoadingState from "../components/LoadingState";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { listingsApi } from "../api/listings";

const EMPTY_FILTERS = {
  brand: [],
  condition: [],
  pta: [],
  storage: [],
  ram: [],
  location: [],
  minPrice: "",
  maxPrice: "",
};

export default function BuyMobile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialBrand = searchParams.get("brand");

  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    brand: initialBrand ? [initialBrand] : [],
  }));
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listingsApi
      .browse({
        q: initialQuery,
        brand: filters.brand,
        condition: filters.condition,
        pta: filters.pta,
        storage: filters.storage,
        ram: filters.ram,
        location: filters.location,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort,
        page,
        limit: 12,
      })
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, sort, page, initialQuery]);

  useEffect(() => setPage(1), [filters, sort, initialQuery]);

  // 👇 Naya: filters change hone par (checkbox select/deselect) URL se "q" hata do
  // taake heading ka "for '...'" text reset ho jaye
  const updateFilters = (updater) => {
    setFilters(updater);
    if (searchParams.get("q")) {
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      setSearchParams(params, { replace: true });
    }
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    if (searchParams.get("q")) {
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      setSearchParams(params, { replace: true });
    }
  };

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Buy a Mobile Phone</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {result.total} phone{result.total !== 1 ? "s" : ""} available
          {initialQuery && <> for “{initialQuery}”</>}
        </p>
        <div className="mt-4 max-w-xl">
          <SearchBar initialValue={initialQuery} clearAfterSearch={false} />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-tag bg-alert-light px-4 py-3 text-sm text-alert">
          Couldn't load listings: {error}. Make sure the backend server is running.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={updateFilters} onReset={resetFilters} />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <button onClick={() => setDrawerOpen(true)} className="btn-secondary lg:hidden">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-ink-faint hidden sm:block">
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field !py-2 !w-auto text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingState count={8} />
          ) : (
            <>
              <MobileGrid mobiles={result.items} />
              <div className="mt-8">
                <Pagination page={page} totalPages={result.totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-paper p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold">Filters</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <FilterSidebar filters={filters} setFilters={updateFilters} onReset={resetFilters} />
            <button onClick={() => setDrawerOpen(false)} className="btn-primary mt-4 w-full">
              Show {result.total} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}