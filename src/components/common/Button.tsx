import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} ${isLoading ? "btn-loading" : ""} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <span className="btn-spinner" /> : children}
      </button>
    );
  },
);

Button.displayName = "Button";