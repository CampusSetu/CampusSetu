import React from "react";
import clsx from "clsx";

const variants = {
  primary:
    "bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 text-white shadow-soft hover:brightness-105",
  secondary:
    "border border-white/70 bg-white/95 text-brand-700 hover:border-brand-200",
  ghost: "text-brand-600 hover:text-brand-700",
  subtle: "bg-brand-50/80 text-brand-600 hover:bg-brand-100",
  link: "text-brand-600 hover:text-brand-700",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  ...props
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || props.disabled}
      className={clsx(base, variants[variant], "disabled:cursor-not-allowed disabled:opacity-70", className)}
      {...props}
    >
      {LeftIcon && <LeftIcon className="h-4 w-4" />}
      {loading ? "Please wait" : children}
      {RightIcon && <RightIcon className="h-4 w-4" />}
    </button>
  );
}
