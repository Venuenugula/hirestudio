import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageContainerProps = {
  children: ReactNode
  className?: string
  /** Soft teal atmosphere behind content (workspace pages). */
  ambient?: boolean
}

export function PageContainer({
  children,
  className,
  ambient = true,
}: PageContainerProps) {
  return (
    <div className="relative isolate min-h-full">
      {ambient ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] overflow-hidden"
        >
          <div className="absolute -top-24 -left-20 size-[22rem] rounded-full bg-teal-200/35 blur-3xl dark:bg-teal-500/10" />
          <div className="absolute top-8 right-[-4rem] size-[26rem] rounded-full bg-cyan-100/45 blur-3xl dark:bg-cyan-400/10" />
          <div className="absolute top-28 left-1/3 size-64 rounded-full bg-emerald-100/30 blur-3xl dark:bg-emerald-400/5" />
        </div>
      ) : null}
      <div
        className={cn(
          "relative mx-auto w-full max-w-6xl space-y-8 p-6 md:space-y-10 md:p-8 lg:p-10",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
