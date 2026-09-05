import { Button } from "@/components/ui/button"
import type { AutosaveStatus } from "@/features/pages/types"

type PublishBarProps = {
  publishedAt: string | null
  autosaveStatus: AutosaveStatus
  isSaving: boolean
  isPublishing: boolean
  disabled?: boolean
  onPublish: () => void
}

function formatPublishedAt(value: string | null) {
  if (!value) {
    return "Never published"
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Never published"
  }
  return `Last published ${date.toLocaleString()}`
}

function formatAutosaveStatus(status: AutosaveStatus) {
  switch (status) {
    case "dirty":
      return "Unsaved changes"
    case "saving":
      return "Saving draft..."
    case "saved":
      return "Draft saved"
    case "error":
      return "Draft save failed"
    default:
      return "Draft up to date"
  }
}

export function PublishBar({
  publishedAt,
  autosaveStatus,
  isSaving,
  isPublishing,
  disabled,
  onPublish,
}: PublishBarProps) {
  const publishDisabled = disabled || isSaving || isPublishing

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {formatPublishedAt(publishedAt)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatAutosaveStatus(autosaveStatus)}
        </p>
      </div>
      <Button
        type="button"
        disabled={publishDisabled}
        onClick={onPublish}
      >
        {isPublishing ? "Publishing..." : isSaving ? "Saving..." : "Publish"}
      </Button>
    </div>
  )
}
