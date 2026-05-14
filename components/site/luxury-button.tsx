import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LuxuryButtonProps = ButtonProps & {
  href?: string;
  icon?: boolean;
};

export function LuxuryButton({ href, children, className, icon = true, ...props }: LuxuryButtonProps) {
  const content = (
    <>
      <span>{children}</span>
      {icon ? <ArrowUpRight className="size-4" /> : null}
    </>
  );

  if (href) {
    return (
      <Button asChild className={cn("tracking-[0.14em] uppercase", className)} {...props}>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button className={cn("tracking-[0.14em] uppercase", className)} {...props}>
      {content}
    </Button>
  );
}
