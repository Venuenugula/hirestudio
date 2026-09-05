import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, GripVertical, List } from "lucide-react"
import { useMemo, useState } from "react"

import {
  sectionLabel,
  sectionPreviewTitle,
} from "@/features/pages/lib/page-config"
import { SECTION_ICONS } from "@/features/pages/lib/section-icons"
import type { PageSection } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type SectionNavigatorProps = {
  sections: PageSection[]
  expandedSectionId: string | null
  disabled?: boolean
  onSelect: (sectionId: string) => void
  onReorder?: (activeId: string, overId: string) => void
  /** Drop outer card chrome when nested inside EditorAccordion. */
  embedded?: boolean
}

export function SectionNavigator({
  sections,
  expandedSectionId,
  disabled,
  onSelect,
  onReorder,
  embedded = false,
}: SectionNavigatorProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  )

  if (sections.length === 0) {
    return null
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !onReorder) {
      return
    }
    onReorder(String(active.id), String(over.id))
  }

  const list = (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sectionIds}
        strategy={verticalListSortingStrategy}
      >
        <ul
          className={cn(
            "flex flex-col gap-1.5",
            embedded ? "sm:grid sm:grid-cols-2 lg:grid-cols-3" : undefined,
          )}
        >
          {sections.map((section) => (
            <SortableNavigatorItem
              key={section.id}
              section={section}
              active={section.id === expandedSectionId}
              disabled={disabled}
              sortable={Boolean(onReorder)}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )

  if (embedded) {
    return (
      <nav aria-label="Section navigator" className="min-w-0">
        {list}
      </nav>
    )
  }

  return (
    <nav
      aria-label="Section navigator"
      className="rounded-xl border border-border bg-card"
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3.5 py-3 text-left transition-colors hover:bg-accent/50 md:hidden"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((current) => !current)}
      >
        <List className="size-4 text-muted-foreground" aria-hidden />
        <span className="flex-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Sections
        </span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
          {sections.length}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            mobileOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <p className="hidden px-3.5 pt-3.5 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:block">
        Sections
      </p>

      <div className={cn("px-2.5 pb-3", !mobileOpen && "hidden md:block")}>
        {list}
      </div>
    </nav>
  )
}

function SortableNavigatorItem({
  section,
  active,
  disabled,
  sortable,
  onSelect,
}: {
  section: PageSection
  active: boolean
  disabled?: boolean
  sortable: boolean
  onSelect: (sectionId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    disabled: disabled || !sortable,
  })

  const hidden = section.hidden === true
  const Icon = SECTION_ICONS[section.type]

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn(isDragging && "z-10 opacity-40")}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-lg px-1 py-1 transition-colors",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "hover:bg-accent",
          hidden && !active && "opacity-70",
        )}
      >
        {sortable ? (
          <button
            type="button"
            ref={setActivatorNodeRef}
            className={cn(
              "inline-flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md transition-colors active:cursor-grabbing",
              active
                ? "text-primary-foreground/80 hover:bg-primary-foreground/15"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              disabled && "pointer-events-none opacity-50",
            )}
            aria-label={`Drag to reorder ${sectionLabel(section.type)}`}
            disabled={disabled}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-3.5" />
          </button>
        ) : null}

        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect(section.id)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "focus-visible:ring-primary-foreground/40"
              : "focus-visible:ring-ring",
          )}
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md",
              active
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
            aria-hidden
          >
            <Icon className="size-3.5" />
          </span>
          <span className="min-w-0 flex-1 truncate font-medium">
            {sectionLabel(section.type)}
          </span>
          {hidden ? (
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                active
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-amber-500/15 text-amber-800 dark:text-amber-200",
              )}
            >
              Hidden
            </span>
          ) : (
            <span
              className={cn(
                "hidden min-w-0 max-w-[5.5rem] truncate text-[11px] xl:inline",
                active
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground",
              )}
            >
              {sectionPreviewTitle(section)}
            </span>
          )}
        </button>
      </div>
    </li>
  )
}
