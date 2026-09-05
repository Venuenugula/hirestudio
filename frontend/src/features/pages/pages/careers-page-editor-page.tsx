import { useCallback, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { ErrorState } from "@/components/shared/error-state"
import { PageContainer } from "@/components/shared/page-container"
import { CareersPageEditorSkeleton } from "@/features/pages/components/careers-page-editor-skeleton"
import { DesignStudio } from "@/features/pages/components/design-studio"
import { EditorAccordion } from "@/features/pages/components/editor-accordion"
import { EditorToolbar } from "@/features/pages/components/editor-toolbar"
import { EmptyPage } from "@/features/pages/components/empty-page"
import { LivePreview } from "@/features/pages/components/live-preview"
import { SectionBlockEditor } from "@/features/pages/components/section-block-editor"
import { SectionNavigator } from "@/features/pages/components/section-navigator"
import { useCareersPageEditor } from "@/features/pages/hooks/use-careers-page-editor"
import { useEditorShortcuts } from "@/features/pages/hooks/use-editor-shortcuts"
import { useUnsavedChangesGuard } from "@/features/pages/hooks/use-unsaved-changes-guard"
import { getErrorMessage } from "@/lib/toast"
import { useAuth } from "@/providers/auth-provider"
import { useWorkspace } from "@/providers/workspace-provider"
import { cn } from "@/lib/utils"

export function CareersPageEditorPage() {
  const { company } = useAuth()
  const { companyId, hasCompany } = useWorkspace()
  const editor = useCareersPageEditor(companyId)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [previewVisible, setPreviewVisible] = useState(true)
  const [designOpen, setDesignOpen] = useState(true)
  const [sectionsNavOpen, setSectionsNavOpen] = useState(false)

  const hasUnsavedChanges =
    editor.autosaveStatus === "dirty" ||
    editor.autosaveStatus === "saving" ||
    editor.autosaveStatus === "error" ||
    editor.isDirty

  useUnsavedChangesGuard({
    when: hasUnsavedChanges && Boolean(editor.draft),
  })

  const saveNow = useCallback(() => {
    void editor.saveNow()
  }, [editor])

  const publishNow = useCallback(() => {
    void editor.publish()
  }, [editor])

  const requestDelete = useCallback((sectionId: string) => {
    setPendingDeleteId(sectionId)
  }, [])

  useEditorShortcuts({
    enabled: Boolean(editor.draft) && !editor.isPublishing,
    preferSaveOverPublish: editor.isSaving,
    expandedSection: editor.expandedSection,
    onSave: saveNow,
    onPublish: publishNow,
    onCollapse: editor.collapseSection,
    onRequestDelete: requestDelete,
  })

  if (!hasCompany || !companyId) {
    return (
      <EditorShell>
        <EmptyPage />
      </EditorShell>
    )
  }

  if (editor.pageQuery.isLoading || !editor.draft) {
    return (
      <EditorShell>
        <CareersPageEditorSkeleton />
      </EditorShell>
    )
  }

  if (editor.pageQuery.isError) {
    return (
      <EditorShell>
        <ErrorState
          message={getErrorMessage(
            editor.pageQuery.error,
            "Could not load careers page draft.",
          )}
          onRetry={() => void editor.pageQuery.refetch()}
        />
      </EditorShell>
    )
  }

  const busy = editor.isPublishing

  const selectSection = (sectionId: string) => {
    editor.scrollAndFocusSection(sectionId)
  }

  return (
    <EditorShell>
      <EditorToolbar
        companyName={company?.name}
        slug={company?.slug}
        autosaveStatus={editor.autosaveStatus}
        isDirty={hasUnsavedChanges}
        isSaving={editor.isSaving}
        isPublishing={editor.isPublishing}
        previewVisible={previewVisible}
        onTogglePreview={() => setPreviewVisible((current) => !current)}
        onSave={saveNow}
        onPublish={publishNow}
      />

      <div className="space-y-3">
        <EditorAccordion
          title="Design tools"
          description="Style · Theme · Typography · Colors"
          open={designOpen}
          onOpenChange={setDesignOpen}
        >
          <DesignStudio
            compact
            theme={editor.draft.theme}
            disabled={busy}
            onChange={editor.updateTheme}
            onApplyStyle={editor.applyStylePreset}
          />
        </EditorAccordion>

        <EditorAccordion
          title="Page sections"
          description="Jump to a block or drag to reorder"
          open={sectionsNavOpen}
          onOpenChange={setSectionsNavOpen}
          meta={
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
              {editor.draft.sections.length}
            </span>
          }
        >
          <SectionNavigator
            sections={editor.draft.sections}
            expandedSectionId={editor.expandedSectionId}
            disabled={busy}
            onSelect={selectSection}
            onReorder={editor.reorderSections}
            embedded
          />
        </EditorAccordion>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          previewVisible && "xl:grid-cols-2",
        )}
      >
        <motion.section
          layout
          className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Editor</h2>
              <p className="text-xs text-muted-foreground">
                Edit sections, copy, and layout blocks
              </p>
            </div>
          </div>
          <div className="max-h-[min(75vh,56rem)] space-y-4 overflow-y-auto p-4">
            <SectionBlockEditor
              sections={editor.draft.sections}
              expandedSectionId={editor.expandedSectionId}
              focusSectionId={editor.focusSectionId}
              disabled={busy}
              onToggleExpand={editor.toggleSectionExpanded}
              onToggleHidden={editor.toggleSectionHidden}
              onDuplicate={editor.duplicateSection}
              onDelete={editor.removeSection}
              onMove={editor.moveSection}
              onReorder={editor.reorderSections}
              onChange={editor.updateSection}
              onAdd={editor.addSection}
              onClearFocus={editor.clearFocusSection}
              pendingDeleteSectionId={pendingDeleteId}
              onPendingDeleteChange={setPendingDeleteId}
            />
          </div>
        </motion.section>

        <AnimatePresence initial={false}>
          {previewVisible ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="min-w-0 xl:sticky xl:top-20 xl:self-start"
            >
              <LivePreview
                draft={editor.draft}
                companyId={companyId}
                company={{
                  name: company?.name ?? "Company",
                  logo_url: company?.logo_url ?? null,
                  primary_color: company?.primary_color ?? "#0F766E",
                  secondary_color: company?.secondary_color ?? "#F8FAFC",
                }}
                slug={company?.slug ?? "preview"}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </EditorShell>
  )
}

function EditorShell({ children }: { children: ReactNode }) {
  return (
    <PageContainer
      ambient={false}
      className="max-w-[1600px] space-y-5 md:space-y-6"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Careers Page Editor
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and customize your public careers page.
        </p>
      </header>
      {children}
    </PageContainer>
  )
}
