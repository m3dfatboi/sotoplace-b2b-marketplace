import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#d18043] text-white hover:bg-[#a76636]",
        secondary: "bg-[#f5f5f5] text-[#1f1f1f] hover:bg-[#e5e5e5]",
        outline: "border border-[#d4d4d4] bg-white hover:bg-[#f5f5f5]",
        ghost: "hover:bg-[#f5f5f5]",
        success: "bg-[#67bb34] text-white hover:bg-[#52962a]",
        error: "bg-[#e03636] text-white hover:bg-[#b32c2b]",
      },
      size: {
        default: "h-[30px] px-4 py-2",
        sm: "h-[24px] px-3 text-xs",
        lg: "h-[40px] px-6",
        icon: "h-[30px] w-[30px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
