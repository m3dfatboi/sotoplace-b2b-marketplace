import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-smooth",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-700",
        primary: "bg-brand-50 text-brand-700 border border-brand-200",
        success: "bg-success-50 text-success-700 border border-success-200",
        error: "bg-error-50 text-error-700 border border-error-200",
        warning: "bg-warning-50 text-warning-700 border border-warning-200",
        info: "bg-info-50 text-info-700 border border-info-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-md",
        md: "px-2.5 py-1 text-sm rounded-lg",
        lg: "px-3 py-1.5 text-sm rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
