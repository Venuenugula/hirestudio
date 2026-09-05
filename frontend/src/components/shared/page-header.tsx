import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: ReactNode
  description?: string
  actions?: ReactNode
  badge?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="space-y-3">
        {badge ? <div className="flex flex-wrap items-center gap-2">{badge}</div> : null}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
