"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-xs": "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends useRender.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  nativeButton?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, render, nativeButton = true, ...props },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLButtonElement | null>(null);

    return useRender({
      defaultTagName: "button",
      render,
      ref: [forwardedRef, internalRef],
      props: mergeProps<"button">(
        {
          className: cn(buttonVariants({ variant, size, className })),
          ...(nativeButton && !render ? { type: "button" } : {}),
        },
        props
      ),
    });
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };