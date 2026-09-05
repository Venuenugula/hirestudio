import { Eye, EyeOff, ExternalLink, Save } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import type { AutosaveStatus } from "@/features/pages/types"
import { cn } from "@/lib/utils"
import { routes } from "@/routes/paths"

type EditorToolbarProps = {
  companyName?: string | null
  slug?: string | null
  autosaveStatus: AutosaveStatus
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean
  previewVisible: boolean
  onTogglePreview: () => void
  onSave: () => void
  onPublish: () => void
}

function saveLabel(status: AutosaveStatus, isDirty: boolean) {
  if (status === "saving") return "Saving…"
  if (status === "error") return "Save failed"
  if (status === "dirty" || isDirty) return "Unsaved changes"
  return "All changes saved"
}

export function EditorToolbar({
  companyName,
  slug,
  autosaveStatus,
  isDirty,
  isSaving,
  isPublishing,
  previewVisible,
  onTogglePreview,
  onSave,
  onPublish,
}: EditorToolbarProps) {
  const savedOk =
    autosaveStatus === "saved" ||
    (autosaveStatus === "idle" && !isDirty)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-3 sm:p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="inline-flex h-9 max-w-[14rem] items-center truncate rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground">
            {companyName || "Company"}
          </span>
          <span className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground">
            Careers page
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "text-sm font-medium",
              savedOk
                ? "text-emerald-600 dark:text-emerald-400"
                : autosaveStatus === "error"
                  ? "text-destructive"
                  : "text-amber-700 dark:text-amber-300",
            )}
          >
            {saveLabel(autosaveStatus, isDirty)}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving || !isDirty}
            onClick={onSave}
          >
            <Save className="size-3.5" />
            Save
          </Button>

          <Button
            type="button"
            size="sm"
            variant={previewVisible ? "default" : "outline"}
            className={
              previewVisible
                ? "bg-violet-600 text-white hover:bg-violet-600/90"
                : undefined
            }
            onClick={onTogglePreview}
          >
            {previewVisible ? (
              <EyeOff className="size-3.5" />
            ) : (
              <Eye className="size-3.5" />
            )}
            {previewVisible ? "Hide preview" : "Show preview"}
          </Button>

          {slug ? (
            <Button asChild variant="outline" size="sm">
              <Link to={routes.publicCareers(slug)} target="_blank">
                <ExternalLink className="size-3.5" />
                Public
              </Link>
            </Button>
          ) : null}

          <Button
            type="button"
            size="sm"
            disabled={isSaving || isPublishing}
            onClick={onPublish}
            className="bg-teal-600 text-white hover:bg-teal-600/90"
          >
            {isPublishing ? "Publishing…" : "Publish page"}
          </Button>
        </div>
      </div>
    </div>
  )
}
