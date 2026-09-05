import { useCallback, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import { ErrorState } from "@/components/shared/error-state"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { AutosaveIndicator } from "@/features/pages/components/autosave-indicator"
import { CareersPageEditorSkeleton } from "@/features/pages/components/careers-page-editor-skeleton"
import { EmptyPage } from "@/features/pages/components/empty-page"
import { LivePreview } from "@/features/pages/components/live-preview"
import { PublishBar } from "@/features/pages/components/publish-bar"
import { SectionBlockEditor } from "@/features/pages/components/section-block-editor"
import { SectionNavigator } from "@/features/pages/components/section-navigator"
import { ThemeEditor } from "@/features/pages/components/theme-editor"
import { useCareersPageEditor } from "@/features/pages/hooks/use-careers-page-editor"
import { useEditorShortcuts } from "@/features/pages/hooks/use-editor-shortcuts"
import { useUnsavedChangesGuard } from "@/features/pages/hooks/use-unsaved-changes-guard"
import { getErrorMessage } from "@/lib/toast"
import { useAuth } from "@/providers/auth-provider"
import { useWorkspace } from "@/providers/workspace-provider"
import { routes } from "@/routes/paths"

export function CareersPageEditorPage() {
  const { company } = useAuth()
  const { companyId, hasCompany } = useWorkspace()
  const editor = useCareersPageEditor(companyId)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

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
    // While a save is in flight, prefer an explicit save over starting publish.
    preferSaveOverPublish: editor.isSaving,
    expandedSection: editor.expandedSection,
    onSave: saveNow,
    onPublish: publishNow,
    onCollapse: editor.collapseSection,
    onRequestDelete: requestDelete,
  })

  if (!hasCompany || !companyId) {
    return (
      <PageContainer>
        <PageHeader
          title="Careers Page"
          description="Edit draft sections and publish the public careers experience."
        />
        <EmptyPage />
      </PageContainer>
    )
  }

  if (editor.pageQuery.isLoading || !editor.draft) {
    return (
      <PageContainer>
        <PageHeader
          title="Careers Page"
          description="Edit draft sections and publish the public careers experience."
        />
        <CareersPageEditorSkeleton />
      </PageContainer>
    )
  }

  if (editor.pageQuery.isError) {
    return (
      <PageContainer>
        <PageHeader
          title="Careers Page"
          description="Edit draft sections and publish the public careers experience."
        />
        <ErrorState
          message={getErrorMessage(
            editor.pageQuery.error,
            "Could not load careers page draft.",
          )}
          onRetry={() => void editor.pageQuery.refetch()}
        />
      </PageContainer>
    )
  }

  const busy = editor.isPublishing

  const selectSection = (sectionId: string) => {
    editor.scrollAndFocusSection(sectionId)
  }

  return (
    <PageContainer className="max-w-7xl">
      <PageHeader
        title="Careers Page"
        description="Build your careers page with collapsible, reorderable blocks."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to={routes.company}>Company settings</Link>
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <PublishBar
          publishedAt={editor.publishedAt}
          lastSavedAt={editor.lastSavedAt}
          autosaveStatus={editor.autosaveStatus}
          isDirty={hasUnsavedChanges}
          isSaving={editor.isSaving}
          isPublishing={editor.isPublishing}
          onPublish={publishNow}
          onSave={saveNow}
        />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-20 xl:self-start">
          <SectionNavigator
            sections={editor.draft.sections}
            expandedSectionId={editor.expandedSectionId}
            disabled={busy}
            onSelect={selectSection}
          />
        </aside>

        <div className="space-y-4">
          <ThemeEditor
            theme={editor.draft.theme}
            disabled={busy}
            onChange={editor.updateTheme}
          />
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

        <div className="xl:sticky xl:top-20 xl:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              <LivePreview
                draft={editor.draft}
                companyId={companyId}
                companyName={company?.name}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AutosaveIndicator status={editor.autosaveStatus} />
    </PageContainer>
  )
}
