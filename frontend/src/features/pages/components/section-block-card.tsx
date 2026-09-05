import { useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
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
import { SECTION_ICONS } from "@/features/pages/lib/section-icons"
import type { PageSection } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type SectionBlockCardProps = {
  section: PageSection
  expanded: boolean
  shouldFocus?: boolean
  index: number
  total: number
  disabled?: boolean
  onToggleExpand: () => void
  onToggleHidden: () => void
  onDuplicate: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onFocused: () => void
  onChange: (sectionId: string, patch: Partial<PageSection>) => void
}

export function SectionBlockCard({
  section,
  expanded,
  shouldFocus,
  index,
  total,
  disabled,
  onToggleExpand,
  onToggleHidden,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onFocused,
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
  const Icon = SECTION_ICONS[section.type]

  useEffect(() => {
    if (!expanded || !shouldFocus) {
      return
    }
    const timer = window.setTimeout(() => {
      const root = document.getElementById(`section-block-${section.id}`)
      const field = root?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        "input, textarea",
      )
      field?.focus()
      field?.select?.()
      onFocused()
    }, 220)
    return () => window.clearTimeout(timer)
  }, [expanded, shouldFocus, section.id, onFocused])

  return (
    <article
      ref={setNodeRef}
      id={`section-block-${section.id}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-xl border border-border bg-card transition-[box-shadow,border-color,opacity]",
        "hover:shadow-sm",
        expanded && "border-ring shadow-sm",
        hidden && "border-dashed opacity-75",
        isDragging && "z-20 scale-[1.01] opacity-90 shadow-lg ring-2 ring-ring/30",
      )}
      aria-label={`${sectionLabel(section.type)} section`}
    >
      <div className="flex items-center gap-1 px-2 py-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          className={cn(
            "inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
            disabled && "pointer-events-none opacity-50",
          )}
          aria-label={`Drag to reorder ${sectionLabel(section.type)}`}
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>

        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md",
            expanded ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
          )}
          aria-hidden
        >
          <Icon className="size-4" />
        </div>

        <button
          type="button"
          className="min-w-0 flex-1 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onToggleExpand}
          disabled={disabled}
          aria-expanded={expanded}
          aria-controls={`section-fields-${section.id}`}
        >
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">
              {sectionPreviewTitle(section)}
            </span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {sectionLabel(section.type)}
            </span>
            {hidden ? (
              <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-200">
                Hidden
              </span>
            ) : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {expanded ? "Editing" : "Click to edit"}
          </p>
        </button>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled || index === 0}
            aria-label="Move section up"
            title="Move up"
            onClick={onMoveUp}
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled || index >= total - 1}
            aria-label="Move section down"
            title="Move down"
            onClick={onMoveDown}
          >
            <ArrowDown className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            aria-label={hidden ? "Show section in preview" : "Hide section from preview"}
            title={hidden ? "Show" : "Hide"}
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
            title="Duplicate"
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
                ? "Delete"
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

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={`section-fields-${section.id}`}
            key="fields"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <SectionFields
              section={section}
              disabled={disabled}
              onChange={onChange}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  )
}
