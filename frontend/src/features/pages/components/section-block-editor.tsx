import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useMemo, useState } from "react"

import { AddSectionDialog } from "@/features/pages/components/add-section-dialog"
import { SectionBlockCard } from "@/features/pages/components/section-block-card"
import {
  sectionLabel,
  sectionPreviewTitle,
} from "@/features/pages/lib/page-config"
import type { PageSection, SectionType } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type SectionBlockEditorProps = {
  sections: PageSection[]
  expandedSectionId: string | null
  disabled?: boolean
  onToggleExpand: (sectionId: string) => void
  onToggleHidden: (sectionId: string) => void
  onDuplicate: (sectionId: string) => void
  onDelete: (sectionId: string) => void
  onReorder: (activeId: string, overId: string) => void
  onChange: (sectionId: string, patch: Partial<PageSection>) => void
  onAdd: (type: SectionType) => void
}

export function SectionBlockEditor({
  sections,
  expandedSectionId,
  disabled,
  onToggleExpand,
  onToggleHidden,
  onDuplicate,
  onDelete,
  onReorder,
  onChange,
  onAdd,
}: SectionBlockEditorProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
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

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) ?? null,
    [activeId, sections],
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) {
      return
    }
    onReorder(String(active.id), String(over.id))
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold">Page blocks</h2>
        <p className="text-xs text-muted-foreground">
          Drag to reorder. Expand one block at a time to edit.
        </p>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No sections yet. Add a block to start building.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={sectionIds}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3">
              {sections.map((section) => (
                <li key={section.id}>
                  <SectionBlockCard
                    section={section}
                    expanded={section.id === expandedSectionId}
                    disabled={disabled}
                    onToggleExpand={() => onToggleExpand(section.id)}
                    onToggleHidden={() => onToggleHidden(section.id)}
                    onDuplicate={() => onDuplicate(section.id)}
                    onDelete={() => onDelete(section.id)}
                    onChange={onChange}
                  />
                </li>
              ))}
            </ul>
          </SortableContext>

          <DragOverlay dropAnimation={null}>
            {activeSection ? (
              <div
                className={cn(
                  "rounded-xl border border-ring bg-card px-4 py-3 shadow-lg",
                )}
              >
                <p className="text-sm font-semibold">
                  {sectionLabel(activeSection.type)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {sectionPreviewTitle(activeSection)}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <AddSectionDialog disabled={disabled} onAdd={onAdd} />
    </div>
  )
}
