import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { sectionLabel } from "@/features/pages/lib/page-config"
import type { PageSection, SectionType } from "@/features/pages/types"
import { cn } from "@/lib/utils"

const ADDABLE_SECTIONS: SectionType[] = [
  "hero",
  "about",
  "benefits",
  "open_roles",
  "cta",
]

type SectionListProps = {
  sections: PageSection[]
  selectedSectionId: string | null
  disabled?: boolean
  onSelect: (sectionId: string) => void
  onAdd: (type: SectionType) => void
  onRemove: (sectionId: string) => void
  onMove: (sectionId: string, direction: "up" | "down") => void
}

export function SectionList({
  sections,
  selectedSectionId,
  disabled,
  onSelect,
  onAdd,
  onRemove,
  onMove,
}: SectionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sections</CardTitle>
        <CardDescription>
          Build your careers page from reusable blocks. Reorder with up/down
          controls.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {ADDABLE_SECTIONS.map((type) => (
            <Button
              key={type}
              type="button"
              size="sm"
              variant="outline"
              disabled={disabled}
              onClick={() => onAdd(type)}
            >
              <Plus className="size-4" />
              Add {sectionLabel(type)}
            </Button>
          ))}
        </div>

        {sections.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            No sections yet. Add a block to start building.
          </p>
        ) : (
          <ul className="space-y-2">
            {sections.map((section, index) => {
              const selected = section.id === selectedSectionId
              const title = section.title || "Untitled"

              return (
                <li key={section.id}>
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-border px-2 py-2",
                      selected && "border-ring bg-muted/40",
                    )}
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate px-2 text-left text-sm font-medium"
                      onClick={() => onSelect(section.id)}
                      disabled={disabled}
                    >
                      <span>{sectionLabel(section.type)}</span>
                      <span className="ml-2 font-normal text-muted-foreground">
                        {title || "Untitled"}
                      </span>
                    </button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      disabled={disabled || index === 0}
                      aria-label="Move section up"
                      onClick={() => onMove(section.id, "up")}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      disabled={disabled || index === sections.length - 1}
                      aria-label="Move section down"
                      onClick={() => onMove(section.id, "down")}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      disabled={disabled}
                      aria-label="Remove section"
                      onClick={() => onRemove(section.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
