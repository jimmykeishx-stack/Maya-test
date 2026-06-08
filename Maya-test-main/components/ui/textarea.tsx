import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-32 w-full rounded-[1.4rem] border border-[rgba(42,39,34,0.12)] bg-white/70 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-[rgba(212,173,94,0.55)] focus:ring-4 focus:ring-[rgba(212,173,94,0.15)] placeholder:text-muted-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
