import {
  cva,
  type VariantProps,
} from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:opacity-80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:opacity-80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:opacity-80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-600 text-white hover:bg-green-600/80",
        warning:
          "border-transparent bg-orange-600 text-white hover:bg-orange-600/80",
        violet:
          "border-transparent bg-violet-600 text-foreground hover:bg-violet-600/80",
        info: "border-transparent text-bg-gray-950 bg-white hover:bg-gray-100/80 dark:bg-gray-950 dark:text-foreground dark:hover:bg-gray-950/80",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
