import * as React from "react"
import { cn } from "@/lib/utils"

function Input( { className, type, ...props }: React.ComponentProps<"input"> )
{
  return (
    <input
      type={type}
      className={cn(
        "h-9 w-full rounded-md px-3 py-1 text-sm md:text-sm",
        "bg-neutral-900/70 text-neutral-200 placeholder:text-neutral-500",
        "border border-[--gold-border] shadow-xs transition-[color,box-shadow,border]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[--gold-focus] focus-visible:border-[--gold-focus] focus-visible:shadow-[0_0_8px_var(--gold-focus)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // gold theme vars
        "[--gold-border:#6a5f2f] [--gold-focus:rgba(218,165,32,0.65)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
