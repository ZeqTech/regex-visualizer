"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  [
    "flex items-center justify-center shrink-0 rounded-md border transition-all outline-none cursor-pointer",
    "bg-[var(--surface)] border-[var(--blue-muted)] text-[var(--foreground)]",
    "focus-visible:ring-[2px] focus-visible:ring-[var(--blue-ring)] focus-visible:border-[var(--blue)]",
    "data-[state=checked]:bg-[var(--blue)] data-[state=checked]:border-[var(--blue)]",
    "data-[state=checked]:text-[var(--primary-foreground)]",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ].join( " " ),
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root>,
  VariantProps<typeof checkboxVariants> { }

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>( ( { className, size, ...props }, ref ) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn( checkboxVariants( { size } ), className )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <CheckIcon
        className={cn(
          size === "sm" && "h-2.5 w-2.5",
          size === "md" && "h-3 w-3",
          size === "lg" && "h-3.5 w-3.5"
        )}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
) )
Checkbox.displayName = "Checkbox"

export { Checkbox }
