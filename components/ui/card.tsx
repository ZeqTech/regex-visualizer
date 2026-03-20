import * as React from "react"
import { cn } from "@/lib/utils"

function Card( { className, ...props }: React.ComponentProps<"div"> )
{
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-lg border border-[var(--blue-muted)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
}

function CardHeader( { className, ...props }: React.ComponentProps<"div"> )
{
  return (
    <div
      data-slot="card-header"
      className={cn(
        "px-6 pt-5 pb-2",
        className
      )}
      {...props}
    />
  )
}

function CardTitle( { className, ...props }: React.ComponentProps<"div"> )
{
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-lg font-semibold tracking-tight text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription( { className, ...props }: React.ComponentProps<"div"> )
{
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm text-[var(--muted-foreground)]",
        className
      )}
      {...props}
    />
  )
}

function CardAction( { className, ...props }: React.ComponentProps<"div"> )
{
  return (
    <div
      data-slot="card-action"
      className={cn(
        "ml-auto self-start",
        className
      )}
      {...props}
    />
  )
}

function CardContent( { className, ...props }: React.ComponentProps<"div"> )
{
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardFooter( { className, ...props }: React.ComponentProps<"div"> )
{
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 pt-4 border-t border-[var(--blue-muted)]",
        className
      )}
      {...props}
    />
  )
}

export
{
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
