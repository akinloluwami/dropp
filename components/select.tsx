import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "outline" | "ghost";
  inputSize?: "default" | "sm" | "lg";
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "default",
      error = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "flex w-full rounded-xl border border-white/5 bg-white/1 text-sm text-white transition-colors disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 appearance-none";

    const variants = {
      default: "", // All main styles are in baseStyles for this look
      outline: "border-white/10 bg-transparent hover:bg-white/5",
      ghost: "border-transparent bg-transparent hover:bg-white/5",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 py-1.5 text-sm",
      lg: "h-11 px-6 py-3 text-base",
    };

    const errorStyles = error
      ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/20 focus:border-red-500/50"
      : "";

    const iconPadding = leftIcon ? "pl-10" : "";
    const rightIconPadding = rightIcon ? "pr-10" : "";

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
            {leftIcon}
          </div>
        )}
        <select
          className={cn(
            baseStyles,
            variants[variant],
            sizes[inputSize],
            iconPadding,
            rightIconPadding,
            errorStyles,
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {children}
        </select>
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
            {rightIcon}
          </div>
        )}
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
