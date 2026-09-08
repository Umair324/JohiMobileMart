export default function FormInput({
  label,
  id,
  hint,
  error,
  required,
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
      <input id={id} className="input-field" {...props} />
      {hint && !error && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
      {error && <p className="mt-1 text-xs text-alert">{error}</p>}
    </div>
  );
}
