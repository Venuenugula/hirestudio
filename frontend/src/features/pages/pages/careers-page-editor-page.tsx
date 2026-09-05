import { Link } from "react-router-dom"

import { ErrorState } from "@/components/shared/error-state"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { CareersPageEditorSkeleton } from "@/features/pages/components/careers-page-editor-skeleton"
import { EmptyPage } from "@/features/pages/components/empty-page"
import { LivePreview } from "@/features/pages/components/live-preview"
import { PublishBar } from "@/features/pages/components/publish-bar"
import { SectionBlockEditor } from "@/features/pages/components/section-block-editor"
import { SectionNavigator } from "@/features/pages/components/section-navigator"
import { ThemeEditor } from "@/features/pages/components/theme-editor"
import { useCareersPageEditor } from "@/features/pages/hooks/use-careers-page-editor"
import { getErrorMessage } from "@/lib/toast"
import { useAuth } from "@/providers/auth-provider"
import { useWorkspace } from "@/providers/workspace-provider"
import { routes } from "@/routes/paths"

export function CareersPageEditorPage() {
  const { company } = useAuth()
  const { companyId, hasCompany } = useWorkspace()
  const editor = useCareersPageEditor(companyId)

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
    editor.expandSection(sectionId)
    window.requestAnimationFrame(() => {
      document
        .getElementById(`section-block-${sectionId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
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

      <PublishBar
        publishedAt={editor.publishedAt}
        autosaveStatus={editor.autosaveStatus}
        isSaving={editor.isSaving}
        isPublishing={editor.isPublishing}
        onPublish={() => {
          void editor.publish()
        }}
      />

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
            disabled={busy}
            onToggleExpand={editor.toggleSectionExpanded}
            onToggleHidden={editor.toggleSectionHidden}
            onDuplicate={editor.duplicateSection}
            onDelete={editor.removeSection}
            onReorder={editor.reorderSections}
            onChange={editor.updateSection}
            onAdd={editor.addSection}
          />
        </div>

        <div className="xl:sticky xl:top-20 xl:self-start">
          <LivePreview
            draft={editor.draft}
            companyId={companyId}
            companyName={company?.name}
          />
        </div>
      </div>
    </PageContainer>
  )
}
