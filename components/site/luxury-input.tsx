import type * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LuxuryInputProps = React.ComponentProps<typeof Input> & {
  label: string;
  hint?: string;
};

export function LuxuryInput({ label, hint, className, ...props }: LuxuryInputProps) {
  return (
    <label className="grid gap-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Input className={cn(className)} {...props} />
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
