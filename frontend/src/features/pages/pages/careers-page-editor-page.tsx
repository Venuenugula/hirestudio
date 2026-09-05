import { Link } from "react-router-dom"

import { ErrorState } from "@/components/shared/error-state"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { CareersPageEditorSkeleton } from "@/features/pages/components/careers-page-editor-skeleton"
import { EmptyPage } from "@/features/pages/components/empty-page"
import { LivePreview } from "@/features/pages/components/live-preview"
import { PublishBar } from "@/features/pages/components/publish-bar"
import { SectionEditor } from "@/features/pages/components/section-editor"
import { SectionList } from "@/features/pages/components/section-list"
import { ThemeEditor } from "@/features/pages/components/theme-editor"
import { useCareersPageEditor } from "@/features/pages/hooks/use-careers-page-editor"
import { getErrorMessage } from "@/lib/toast"
import { useWorkspace } from "@/providers/workspace-provider"
import { routes } from "@/routes/paths"

export function CareersPageEditorPage() {
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

  return (
    <PageContainer className="max-w-7xl">
      <PageHeader
        title="Careers Page"
        description="Edit draft sections and publish the public careers experience."
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <ThemeEditor
            theme={editor.draft.theme}
            disabled={busy}
            onChange={editor.updateTheme}
          />
          <SectionList
            sections={editor.draft.sections}
            selectedSectionId={editor.selectedSectionId}
            disabled={busy}
            onSelect={editor.setSelectedSectionId}
            onAdd={editor.addSection}
            onRemove={editor.removeSection}
            onMove={editor.moveSection}
          />
          <SectionEditor
            section={editor.selectedSection}
            disabled={busy}
            onChange={editor.updateSection}
          />
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <LivePreview draft={editor.draft} />
        </div>
      </div>
    </PageContainer>
  )
}
