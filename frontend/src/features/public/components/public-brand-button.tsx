import type { CSSProperties, ButtonHTMLAttributes } from "react"

import type { ButtonStyleId } from "@/features/pages/lib/design-system"
import { cn } from "@/lib/utils"

type PublicBrandButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonStyle?: ButtonStyleId
  tone?: "on-brand" | "on-light" | "on-dark"
}

export function PublicBrandButton({
  buttonStyle = "filled",
  tone = "on-light",
  className,
  style,
  children,
  ...props
}: PublicBrandButtonProps) {
  const radius =
    buttonStyle === "pill" ? "999px" : "var(--public-radius, 12px)"

  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--public-primary)]/40 disabled:pointer-events-none disabled:opacity-50"

  if (buttonStyle === "outline") {
    return (
      <button
        type="button"
        className={cn(base, "border-2 bg-transparent", className)}
        style={
          {
            borderRadius: radius,
            borderColor: "var(--public-primary)",
            color: "var(--public-primary)",
            ...style,
          } as CSSProperties
        }
        {...props}
      >
        {children}
      </button>
    )
  }

  if (buttonStyle === "ghost") {
    return (
      <button
        type="button"
        className={cn(base, "bg-transparent underline-offset-4 hover:underline", className)}
        style={
          {
            borderRadius: radius,
            color: "var(--public-primary)",
            ...style,
          } as CSSProperties
        }
        {...props}
      >
        {children}
      </button>
    )
  }

  if (tone === "on-dark" || tone === "on-brand") {
    return (
      <button
        type="button"
        className={cn(base, "bg-white shadow-sm", className)}
        style={
          {
            borderRadius: radius,
            color: "var(--public-primary)",
            ...style,
          } as CSSProperties
        }
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={cn(base, "text-white shadow-sm", className)}
      style={
        {
          borderRadius: radius,
          backgroundColor: "var(--public-primary)",
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </button>
  )
}
