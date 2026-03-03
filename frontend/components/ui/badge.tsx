import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-700 border border-neutral-200/60",
        primary: "bg-gradient-to-br from-primary-50 to-primary-100/50 text-primary-700 border border-primary-200/60 shadow-sm",
        success: "bg-gradient-to-br from-success-50 to-success-100/50 text-success-700 border border-success-200/60 shadow-sm",
        warning: "bg-gradient-to-br from-warning-50 to-warning-100/50 text-warning-700 border border-warning-200/60 shadow-sm",
        error: "bg-gradient-to-br from-error-50 to-error-100/50 text-error-700 border border-error-200/60 shadow-sm",
        info: "bg-gradient-to-br from-info-50 to-info-100/50 text-info-700 border border-info-200/60 shadow-sm",
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
