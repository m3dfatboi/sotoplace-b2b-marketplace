import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[8px] whitespace-nowrap rounded-[8px] text-[14px] font-medium leading-[18px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1f1f1f] text-white hover:bg-[#525252]",
        primary: "bg-[#1f1f1f] text-white hover:bg-[#525252]",
        secondary: "bg-white border border-[#d4d4d4] text-[#1f1f1f] hover:bg-[#f5f5f5]",
        outline: "border border-[#d4d4d4] bg-white text-[#1f1f1f] hover:bg-[#f5f5f5]",
        ghost: "hover:bg-[#f5f5f5] text-[#1f1f1f]",
        success: "bg-[#67bb34] text-white hover:bg-[#52962a]",
        error: "bg-[#e03636] text-white hover:bg-[#b32c2b]",
        furnita: "bg-[#d18043] text-white hover:bg-[#a76636]",
      },
      size: {
        default: "h-[30px] px-[14px]",
        sm: "h-[24px] px-[12px] text-[12px] leading-[14px]",
        lg: "h-[40px] px-[20px]",
        icon: "h-[30px] w-[30px] p-0",
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
