import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.12),_0_1px_2px_-1px_rgb(0_0_0_/_0.12)] hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.15),_0_2px_4px_-2px_rgb(0_0_0_/_0.15)]",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200",
        outline: "border border-neutral-300 bg-transparent hover:bg-neutral-50 active:bg-neutral-100",
        ghost: "hover:bg-neutral-100 active:bg-neutral-200",
        danger: "bg-gradient-to-br from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 active:from-error-700 active:to-error-800 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.12)]",
        success: "bg-gradient-to-br from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 active:from-success-700 active:to-success-800 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.12)]",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-lg",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-12 px-6 text-base rounded-lg font-semibold",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
