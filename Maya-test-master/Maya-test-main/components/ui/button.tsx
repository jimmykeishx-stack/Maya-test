import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-[rgba(212,173,94,0.35)] bg-[linear-gradient(135deg,#d4ad5e_0%,#b89041_100%)] text-[#16120d] shadow-[0_20px_50px_rgba(27,22,16,0.18)] hover:-translate-y-0.5",
        secondary: "border-white/15 bg-white/5 text-white hover:border-[rgba(212,173,94,0.4)] hover:bg-white/10",
        outline: "border-[rgba(42,39,34,0.12)] bg-transparent text-foreground hover:bg-black/[0.03]",
        ghost: "border-transparent bg-transparent text-foreground hover:bg-black/[0.03]",
        dark: "border-[rgba(212,173,94,0.18)] bg-[#13110f] text-[#f5efe5] hover:-translate-y-0.5 hover:bg-[#1b1814]"
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-7 text-[0.95rem]",
        icon: "size-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
