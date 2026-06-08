import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-[rgba(42,39,34,0.08)] bg-[rgba(255,251,244,0.72)] text-card-foreground shadow-[0_28px_90px_rgba(16,12,8,0.08)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 md:p-8", className)} {...props} />;
}
