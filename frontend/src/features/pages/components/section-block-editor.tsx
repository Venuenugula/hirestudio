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
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { AnimatePresence, motion } from "framer-motion"
import { LayoutTemplate } from "lucide-react"
import { useMemo, useState } from "react"

import { EmptyState } from "@/components/shared/empty-state"
import { AddSectionDialog } from "@/features/pages/components/add-section-dialog"
import { DeleteSectionDialog } from "@/features/pages/components/delete-section-dialog"
import { SectionBlockCard } from "@/features/pages/components/section-block-card"
import {
  sectionLabel,
  sectionPreviewTitle,
} from "@/features/pages/lib/page-config"
import { SECTION_ICONS } from "@/features/pages/lib/section-icons"
import type { PageSection, SectionType } from "@/features/pages/types"
import { cn } from "@/lib/utils"

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
}

type SectionBlockEditorProps = {
  sections: PageSection[]
  expandedSectionId: string | null
  focusSectionId: string | null
  disabled?: boolean
  onToggleExpand: (sectionId: string) => void
  onToggleHidden: (sectionId: string) => void
  onDuplicate: (sectionId: string) => void
  onDelete: (sectionId: string) => void
  onMove: (sectionId: string, direction: "up" | "down") => void
  onReorder: (activeId: string, overId: string) => void
  onChange: (sectionId: string, patch: Partial<PageSection>) => void
  onAdd: (type: SectionType) => void
  onClearFocus: () => void
  pendingDeleteSectionId?: string | null
  onPendingDeleteChange?: (sectionId: string | null) => void
}

export function SectionBlockEditor({
  sections,
  expandedSectionId,
  focusSectionId,
  disabled,
  onToggleExpand,
  onToggleHidden,
  onDuplicate,
  onDelete,
  onMove,
  onReorder,
  onChange,
  onAdd,
  onClearFocus,
  pendingDeleteSectionId,
  onPendingDeleteChange,
}: SectionBlockEditorProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [internalDeleteId, setInternalDeleteId] = useState<string | null>(null)

  const deleteId =
    pendingDeleteSectionId !== undefined
      ? pendingDeleteSectionId
      : internalDeleteId
  const setDeleteId = onPendingDeleteChange ?? setInternalDeleteId

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

  const deleteSection = useMemo(
    () => sections.find((section) => section.id === deleteId) ?? null,
    [deleteId, sections],
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

  const requestDelete = (sectionId: string) => {
    setDeleteId(sectionId)
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold">Page blocks</h2>
        <p className="text-xs text-muted-foreground">
          Drag to reorder. Only one block stays open at a time.
        </p>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="No sections yet"
          description="Add a Hero, About, Benefits, Open Roles, or CTA block to start building your careers page."
          className="py-12"
          action={<AddSectionDialog disabled={disabled} onAdd={onAdd} />}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext
            items={sectionIds}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {sections.map((section, index) => (
                  <motion.li
                    key={section.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <SectionBlockCard
                      section={section}
                      expanded={section.id === expandedSectionId}
                      shouldFocus={section.id === focusSectionId}
                      index={index}
                      total={sections.length}
                      disabled={disabled}
                      onToggleExpand={() => onToggleExpand(section.id)}
                      onToggleHidden={() => onToggleHidden(section.id)}
                      onDuplicate={() => onDuplicate(section.id)}
                      onDelete={() => requestDelete(section.id)}
                      onMoveUp={() => onMove(section.id, "up")}
                      onMoveDown={() => onMove(section.id, "down")}
                      onFocused={onClearFocus}
                      onChange={onChange}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </SortableContext>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeSection ? (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-ring bg-card px-4 py-3 shadow-xl",
                )}
              >
                {(() => {
                  const Icon = SECTION_ICONS[activeSection.type]
                  return (
                    <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                  )
                })()}
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {sectionLabel(activeSection.type)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {sectionPreviewTitle(activeSection)}
                  </p>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {sections.length > 0 ? (
        <AddSectionDialog disabled={disabled} onAdd={onAdd} />
      ) : null}

      <DeleteSectionDialog
        open={Boolean(deleteSection)}
        section={deleteSection}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null)
          }
        }}
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId)
          }
        }}
      />
    </div>
  )
}
