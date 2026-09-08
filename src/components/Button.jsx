const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const VARIANT_CLASS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  tag: "btn-tag",
  ghost: "btn-ghost",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button className={`${VARIANT_CLASS[variant]} ${SIZES[size]} ${className}`} {...props}>
      {Icon && <Icon size={18} strokeWidth={2} />}
      {children}
    </button>
  );
}
