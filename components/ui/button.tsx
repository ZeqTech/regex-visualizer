import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium shrink-0 outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--blue)] text-[var(--primary-foreground)]",
          "hover:bg-[var(--blue-strong)]",
          "border border-transparent",
          "focus-visible:ring-[2px] focus-visible:ring-[var(--blue-ring)]"
        ].join( " " ),
        outline: [
          "bg-transparent text-[var(--foreground)]",
          "border border-[var(--blue-muted)]",
          "hover:bg-[var(--surface-hover)] hover:border-[var(--blue)]",
          "focus-visible:ring-[2px] focus-visible:ring-[var(--blue-ring)]"
        ].join( " " ),
        secondary: [
          "bg-[var(--surface)] text-[var(--foreground)]",
          "hover:bg-[var(--surface-hover)]",
          "border border-[var(--blue-muted)]"
        ].join( " " ),
        ghost: [
          "text-[var(--foreground)]",
          "hover:bg-[var(--surface-hover)]"
        ].join( " " ),
        link: [
          "text-[var(--blue)] underline-offset-4 hover:underline"
        ].join( " " ),
        destructive: "bg-[var(--destructive)] text-white hover:bg-red-700"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 py-1.5",
        lg: "h-10 px-6 py-2",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }
>( ( { className, variant, size, asChild = false, ...props }, ref ) =>
{
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      className={cn( buttonVariants( { variant, size } ), className )}
      {...props}
    />
  )
} )
Button.displayName = "Button"

export { Button, buttonVariants }
