import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionFields } from "@/features/pages/components/section-fields"
import {
  canDeleteSection,
  sectionLabel,
  sectionPreviewTitle,
} from "@/features/pages/lib/page-config"
import type { PageSection } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type SectionBlockCardProps = {
  section: PageSection
  expanded: boolean
  disabled?: boolean
  onToggleExpand: () => void
  onToggleHidden: () => void
  onDuplicate: () => void
  onDelete: () => void
  onChange: (sectionId: string, patch: Partial<PageSection>) => void
}

export function SectionBlockCard({
  section,
  expanded,
  disabled,
  onToggleExpand,
  onToggleHidden,
  onDuplicate,
  onDelete,
  onChange,
}: SectionBlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled })

  const hidden = section.hidden === true
  const deletable = canDeleteSection(section)

  return (
    <article
      ref={setNodeRef}
      id={`section-block-${section.id}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-xl border border-border bg-card transition-shadow",
        "hover:shadow-sm",
        expanded && "border-ring shadow-sm",
        hidden && "border-dashed opacity-75",
        isDragging && "z-20 opacity-95 shadow-lg ring-2 ring-ring/40",
      )}
    >
      <div className="flex items-center gap-1 px-2 py-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          className={cn(
            "inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing",
            disabled && "pointer-events-none opacity-50",
          )}
          aria-label={`Drag ${sectionLabel(section.type)} section`}
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          className="min-w-0 flex-1 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent/60"
          onClick={onToggleExpand}
          disabled={disabled}
          aria-expanded={expanded}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-sm font-semibold">
              {sectionLabel(section.type)}
            </span>
            {hidden ? (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Hidden
              </span>
            ) : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {sectionPreviewTitle(section)}
          </p>
        </button>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            aria-label={hidden ? "Show section" : "Hide section"}
            onClick={onToggleHidden}
          >
            {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            aria-label="Duplicate section"
            onClick={onDuplicate}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled || !deletable}
            aria-label={
              deletable
                ? "Delete section"
                : `${sectionLabel(section.type)} cannot be deleted`
            }
            title={
              deletable
                ? "Delete section"
                : `${sectionLabel(section.type)} cannot be deleted`
            }
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            aria-label={expanded ? "Collapse section" : "Expand section"}
            onClick={onToggleExpand}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                expanded && "rotate-180",
              )}
            />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <SectionFields
            section={section}
            disabled={disabled}
            onChange={onChange}
          />
        </div>
      </div>
    </article>
  )
}
