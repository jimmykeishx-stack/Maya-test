import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
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
    const { variant, size } = props;

    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size, className }), "tracking-[0.14em] uppercase")}
      >
        {content}
      </Link>
    );
  }

  return (
    <Button className={cn("tracking-[0.14em] uppercase", className)} {...props}>
      {content}
    </Button>
  );
}
