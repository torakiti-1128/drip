import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-[var(--brand-soft)] text-[var(--brand)]",
      outline: "border border-[var(--line)] bg-white/80 text-[var(--muted-foreground)]",
      success: "bg-emerald-50 text-emerald-700",
      warn: "bg-amber-50 text-amber-700"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
