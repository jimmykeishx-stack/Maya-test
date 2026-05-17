import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="quiet-label text-[var(--gold-strong)]">{eyebrow}</p> : null}
      {title ? <h2 className="font-display text-4xl leading-tight text-balance md:text-5xl">{title}</h2> : null}
      {description ? <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
    </div>
  );
}
