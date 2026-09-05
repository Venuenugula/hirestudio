import type { CSSProperties, ReactNode } from "react"

import type { Company } from "@/features/company/types"
import type { PageTheme } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type PublicShellProps = {
  company: Pick<Company, "name" | "logo_url">
  theme: PageTheme
  children: ReactNode
  className?: string
}

/** Applies brand CSS variables and page background for the public careers site. */
export function PublicShell({
  company,
  theme,
  children,
  className,
}: PublicShellProps) {
  return (
    <div
      className={cn("min-h-screen", className)}
      style={
        {
          "--public-primary": theme.primaryColor,
          "--public-secondary": theme.secondaryColor,
          backgroundColor: theme.secondaryColor,
          color: theme.primaryColor,
        } as CSSProperties
      }
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <header className="border-b border-black/10 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt=""
              className="size-9 rounded-md object-cover"
            />
          ) : null}
          <p className="text-lg font-semibold tracking-tight">{company.name}</p>
        </div>
      </header>
      <main id="main-content">{children}</main>
    </div>
  )
}
