import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand)] px-5 py-3 text-white shadow-[0_14px_40px_rgba(32,78,124,0.28)] hover:bg-[var(--brand-strong)] focus-visible:ring-[var(--brand)]",
        secondary:
          "border border-[var(--line)] bg-white/80 px-5 py-3 text-[var(--foreground)] hover:bg-white focus-visible:ring-[var(--brand)]",
        ghost:
          "px-3 py-2 text-[var(--muted-foreground)] hover:bg-white/80 hover:text-[var(--foreground)] focus-visible:ring-[var(--brand)]"
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base"
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
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";
