import React from "react";
import clsx from "clsx";

const variants = {
  primary:
    "bg-brand-500 text-white shadow-card hover:bg-brand-600 hover:shadow-elevated focus-visible:shadow-focus",
  secondary:
    "border border-slate-200/80 bg-white text-slate-700 hover:border-slate-300/80 hover:-translate-y-0.5",
  ghost: "text-slate-600 hover:text-slate-900",
  subtle: "bg-slate-100 text-slate-700 hover:bg-slate-200",
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
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 ease-out-expo will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2";
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
