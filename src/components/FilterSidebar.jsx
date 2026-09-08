import {
  brands,
  conditions,
  ptaOptions,
  storageOptions,
  ramOptions,
  locations,
} from "../data/categories";
import { RotateCcw } from "lucide-react";

function CheckboxGroup({ title, options, selected, onToggle }) {
  return (
    <fieldset className="border-b border-paper-line pb-4">
      <legend className="mb-2.5 text-sm font-bold text-ink">{title}</legend>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-ink-light cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-4 w-4 rounded border-paper-line text-bazaar-500 focus:ring-bazaar-300"
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function FilterSidebar({ filters, setFilters, onReset }) {
  const toggle = (key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="card-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">Filters</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-bazaar-600 hover:text-bazaar-700"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <CheckboxGroup
          title="Brand"
          options={brands}
          selected={filters.brand}
          onToggle={(v) => toggle("brand", v)}
        />

        <fieldset className="border-b border-paper-line pb-4">
          <legend className="mb-2.5 text-sm font-bold text-ink">Price Range (Rs.)</legend>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
              className="input-field !py-2 text-sm"
            />
            <span className="text-ink-faint">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
              className="input-field !py-2 text-sm"
            />
          </div>
        </fieldset>

        <CheckboxGroup
          title="Condition"
          options={conditions}
          selected={filters.condition}
          onToggle={(v) => toggle("condition", v)}
        />

        <CheckboxGroup
          title="PTA Status"
          options={ptaOptions}
          selected={filters.pta}
          onToggle={(v) => toggle("pta", v)}
        />

        <CheckboxGroup
          title="Storage"
          options={storageOptions}
          selected={filters.storage}
          onToggle={(v) => toggle("storage", v)}
        />

        <CheckboxGroup
          title="RAM"
          options={ramOptions}
          selected={filters.ram}
          onToggle={(v) => toggle("ram", v)}
        />

        <fieldset className="pb-1">
          <legend className="mb-2.5 text-sm font-bold text-ink">Location</legend>
          <div className="flex flex-col gap-2">
            {locations.map((loc) => (
              <label key={loc} className="flex items-center gap-2 text-sm text-ink-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.location.includes(loc)}
                  onChange={() => toggle("location", loc)}
                  className="h-4 w-4 rounded border-paper-line text-bazaar-500 focus:ring-bazaar-300"
                />
                {loc}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
