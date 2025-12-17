import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black shadow hover:bg-primary/90 active:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/40 [text-shadow:0_0_0_rgba(0,0,0,0)]",
        destructive:
          "bg-destructive text-black shadow-sm hover:bg-destructive/90 active:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-destructive/40",
        outline:
          "border border-input text-gray-800 shadow-sm hover:bg-accent hover:text-black active:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/30",
        secondary:
          "bg-secondary text-black shadow-sm hover:bg-secondary/80 active:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary/30",
        ghost:
          "bg-transparent text-black hover:bg-accent hover:text-black active:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/20",
        link:
          "text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }