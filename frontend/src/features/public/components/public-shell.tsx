import type { CSSProperties, ReactNode } from "react"

import type { Company } from "@/features/company/types"
import type { PageTheme } from "@/features/pages/types"
import {
  resolveFontFamily,
  resolveRadius,
} from "@/features/pages/lib/design-system"
import { PUBLIC_DESIGN } from "@/features/public/lib/public-design"
import { cn } from "@/lib/utils"

type PublicShellProps = {
  company: Pick<Company, "name" | "logo_url">
  theme: PageTheme
  children: ReactNode
  className?: string
}

/**
 * Applies brand + design-system CSS variables from page theme
 * (draft or published).
 */
export function PublicShell({
  company,
  theme,
  children,
  className,
}: PublicShellProps) {
  const primary = theme.primaryColor?.trim() || PUBLIC_DESIGN.primary
  const secondary = theme.secondaryColor?.trim() || PUBLIC_DESIGN.background
  const fontFamily = resolveFontFamily(theme.fontId)
  const radius = resolveRadius(theme.radiusId)
  const styleId = theme.styleId ?? "professional"

  return (
    <div
      className={cn("min-h-screen", className)}
      data-page-style={styleId}
      style={
        {
          "--public-primary": primary,
          "--public-secondary": secondary,
          "--public-accent": primary,
          "--public-background": secondary,
          "--public-surface": PUBLIC_DESIGN.surface,
          "--public-foreground": PUBLIC_DESIGN.foreground,
          "--public-muted": PUBLIC_DESIGN.muted,
          "--public-border": PUBLIC_DESIGN.border,
          "--public-hover": `color-mix(in srgb, ${primary} 10%, white)`,
          "--public-radius": radius,
          "--public-font": fontFamily,
          backgroundColor: "var(--public-background)",
          color: "var(--public-foreground)",
          fontFamily: "var(--public-font)",
        } as CSSProperties
      }
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "border-b border-[var(--public-border)] px-4 py-4 backdrop-blur md:px-8",
          styleId === "enterprise"
            ? "bg-[var(--public-primary)] text-white"
            : "bg-[var(--public-surface)]/90",
        )}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt=""
              className="size-9 object-cover"
              style={{ borderRadius: "var(--public-radius)" }}
            />
          ) : (
            <span
              className={cn(
                "flex size-9 items-center justify-center text-sm font-bold",
                styleId === "enterprise"
                  ? "bg-white/15 text-white"
                  : "text-white",
              )}
              style={{
                borderRadius: "var(--public-radius)",
                backgroundColor:
                  styleId === "enterprise" ? undefined : "var(--public-primary)",
              }}
            >
              {company.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div>
            <p className="text-lg font-semibold tracking-tight">
              {company.name}
            </p>
            <p
              className={cn(
                "text-xs",
                styleId === "enterprise"
                  ? "text-white/70"
                  : "text-[var(--public-muted)]",
              )}
            >
              Careers
            </p>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
    </div>
  )
}
