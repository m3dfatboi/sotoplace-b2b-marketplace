import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-fast",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-700 border border-neutral-200",
        primary: "bg-primary-50 text-primary-700 border border-primary-200",
        success: "bg-success-50 text-success-700 border border-success-200",
        warning: "bg-warning-50 text-warning-700 border border-warning-200",
        error: "bg-error-50 text-error-700 border border-error-200",
        info: "bg-info-50 text-info-700 border border-info-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-md",
        md: "px-2.5 py-1 text-sm rounded-md",
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
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
