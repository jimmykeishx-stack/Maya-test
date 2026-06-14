import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] uppercase tracking-[0.26em]", {
  variants: {
    variant: {
      default: "bg-[rgba(212,173,94,0.14)] text-[var(--gold-strong)]",
      dark: "bg-white/8 text-white",
      outline: "border border-[rgba(42,39,34,0.12)] bg-transparent text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
