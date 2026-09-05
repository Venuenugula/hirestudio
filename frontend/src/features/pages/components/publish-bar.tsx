import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import type { AutosaveStatus } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type PublishBarProps = {
  publishedAt: string | null
  lastSavedAt: string | null
  autosaveStatus: AutosaveStatus
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean
  disabled?: boolean
  onPublish: () => void
  onSave?: () => void
}

function formatDateParts(value: string | null) {
  if (!value) {
    return null
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return {
    date: date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: undefined,
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  }
}

function formatRelativeSaved(value: string | null, status: AutosaveStatus) {
  if (status === "saving") {
    return "Saving…"
  }
  if (status === "dirty") {
    return "Unsaved changes"
  }
  if (status === "error") {
    return "Save failed"
  }
  if (!value) {
    return "Not saved yet"
  }
  const parts = formatDateParts(value)
  if (!parts) {
    return "Saved"
  }
  return `Last saved ${parts.date} · ${parts.time}`
}

export function PublishBar({
  publishedAt,
  lastSavedAt,
  autosaveStatus,
  isDirty,
  isSaving,
  isPublishing,
  disabled,
  onPublish,
  onSave,
}: PublishBarProps) {
  const published = formatDateParts(publishedAt)
  const publishDisabled = disabled || isSaving || isPublishing

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">
            {published ? "Published" : "Not published"}
          </p>
          {published ? (
            <span className="text-sm text-muted-foreground">
              {published.date}
              <span className="mx-1.5 text-border">·</span>
              {published.time}
            </span>
          ) : null}
          <AnimatePresence>
            {isDirty ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-200"
              >
                Unsaved
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatRelativeSaved(lastSavedAt, autosaveStatus)}
          {publishedAt ? (
            <>
              <span className="mx-1.5 text-border">·</span>
              Last published{" "}
              {published
                ? `${published.date} ${published.time}`
                : "unknown"}
            </>
          ) : null}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onSave ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isSaving || !isDirty}
            onClick={onSave}
            title="Save draft"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        ) : null}
        <Button
          type="button"
          disabled={publishDisabled}
          onClick={onPublish}
          title="Publish (Ctrl/⌘ S)"
          className={cn(isPublishing && "opacity-90")}
        >
          {isPublishing ? "Publishing..." : isSaving ? "Saving..." : "Publish"}
        </Button>
      </div>
    </div>
  )
}
