import {
  sectionLabel,
  sectionPreviewTitle,
} from "@/features/pages/lib/page-config"
import type { PageSection } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type SectionNavigatorProps = {
  sections: PageSection[]
  expandedSectionId: string | null
  disabled?: boolean
  onSelect: (sectionId: string) => void
}

export function SectionNavigator({
  sections,
  expandedSectionId,
  disabled,
  onSelect,
}: SectionNavigatorProps) {
  if (sections.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Section navigator"
      className="rounded-xl border border-border bg-card p-3"
    >
      <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Sections
      </p>
      <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {sections.map((section) => {
          const active = section.id === expandedSectionId
          const hidden = section.hidden === true
          return (
            <li key={section.id} className="shrink-0 lg:w-full">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(section.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                  hidden && !active && "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    active ? "bg-primary-foreground" : "bg-foreground/40",
                    hidden && !active && "bg-muted-foreground/50",
                  )}
                  aria-hidden
                />
                <span className="min-w-0 truncate font-medium">
                  {sectionLabel(section.type)}
                </span>
                {hidden ? (
                  <span
                    className={cn(
                      "ml-auto text-[10px] font-semibold tracking-wide uppercase",
                      active ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    Hidden
                  </span>
                ) : (
                  <span
                    className={cn(
                      "ml-auto hidden truncate text-xs lg:inline",
                      active
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {sectionPreviewTitle(section)}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
