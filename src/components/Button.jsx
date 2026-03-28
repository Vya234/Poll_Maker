import React from "react";
import { cn } from "../lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition duration-200 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const sizes = {
  md: "min-h-[2.75rem] rounded-xl px-5 py-2.5 text-base",
  sm: "min-h-9 rounded-lg px-3.5 py-2 text-sm",
};

const variants = {
  primary:
    "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-900/15 hover:brightness-105 hover:-translate-y-px",
  secondary:
    "border-2 border-brand-500/45 bg-white text-brand-700 shadow-sm hover:border-brand-500 hover:bg-brand-50",
  danger:
    "bg-gradient-to-br from-danger-500 to-danger-600 text-white shadow-md shadow-danger-600/25 hover:brightness-105",
  dashed:
    "border-2 border-dashed border-brand-500/45 bg-transparent text-brand-700 hover:bg-brand-500/[0.07]",
  dark:
    "bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-md hover:brightness-110",
  onGreen:
    "border-2 border-white/90 bg-white/95 text-brand-800 shadow-md hover:bg-white",
};

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    />
  );
};

export default Button;
