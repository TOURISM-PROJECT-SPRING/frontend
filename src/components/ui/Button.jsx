import Icon from "./Icon";

const VARIANTS = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 shadow-sm hover:shadow-md",
  gold: "bg-gold-400 text-brand-900 hover:bg-gold-300 shadow-sm hover:shadow-md",
  secondary:
    "bg-white text-brand-800 border border-line hover:border-brand-300 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-800 hover:bg-brand-50",
  outlineLight: "bg-transparent text-white border border-white/40 hover:bg-white/10",
};

const SIZES = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

export default function Button({
  as,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  icon,
  iconRight,
  ...rest
}) {
  const Comp = as || (href ? "a" : "button");
  const classes = `inline-flex items-center justify-center rounded-xl font-semibold tracking-tight transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:opacity-60 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  return (
    <Comp href={href} className={classes} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} className="transition-transform group-hover:translate-x-0.5" />}
    </Comp>
  );
}
