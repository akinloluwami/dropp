import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "outline" | "ghost";
  inputSize?: "default" | "sm" | "lg";
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "default",
      error = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "flex w-full rounded-xl border border-white/5 bg-white/1 text-sm text-white placeholder:text-white/50 transition-colors disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 resize-none";

    const variants = {
      default: "", // All main styles are in baseStyles for this look
      outline: "border-white/10 bg-transparent hover:bg-white/5",
      ghost: "border-transparent bg-transparent hover:bg-white/5",
    };

    const sizes = {
      default: "px-4 py-3",
      sm: "px-3 py-2 text-sm",
      lg: "px-6 py-4 text-base",
    };

    const errorStyles = error
      ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/20 focus:border-red-500/50"
      : "";

    const iconPadding = leftIcon ? "pl-10" : "";
    const rightIconPadding = rightIcon ? "pr-10" : "";

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-3 text-white/50">{leftIcon}</div>
        )}
        <textarea
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
        />
        {rightIcon && (
          <div className="absolute right-3 top-3 text-white/50">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
