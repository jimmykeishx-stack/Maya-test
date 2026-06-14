import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-[1.2rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-[rgba(212,173,94,0.55)] focus:ring-4 focus:ring-[rgba(212,173,94,0.15)] placeholder:text-muted-foreground",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
