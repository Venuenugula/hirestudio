import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type EditorAccordionProps = {
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
  meta?: ReactNode
}

/** Thin collapsible bar matching certificate-editor style panels. */
export function EditorAccordion({
  title,
  description,
  open,
  onOpenChange,
  children,
  meta,
}: EditorAccordionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {meta}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="border-t border-border px-4 py-4">{children}</div>
      ) : null}
    </div>
  )
}
