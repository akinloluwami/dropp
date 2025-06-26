import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error = false, disabled, ...props }, ref) => {
    const baseStyles =
      "h-4 w-4 rounded border border-white/5 bg-white/1 text-white transition-colors disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20";

    const errorStyles = error
      ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/20 focus:border-red-500/50"
      : "";

    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          className={cn(baseStyles, errorStyles, className)}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {label && (
          <label
            className={cn(
              "text-sm text-white",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
