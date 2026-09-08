import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  id,
  required,
  options = [],
  placeholder = "Select...",
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label-field">
          {label} {required && <span className="text-alert">*</span>}
        </label>
      )}
      <div className="relative">
        <select id={id} className="input-field appearance-none pr-9" {...props}>
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
        />
      </div>
    </div>
  );
}
