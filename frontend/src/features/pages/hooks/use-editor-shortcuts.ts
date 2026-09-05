import { useEffect } from "react"

import { canDeleteSection } from "@/features/pages/lib/page-config"
import type { PageSection } from "@/features/pages/types"

type UseEditorShortcutsOptions = {
  enabled?: boolean
  /** When true, Ctrl/Cmd+S saves draft instead of publishing. */
  preferSaveOverPublish?: boolean
  expandedSection: PageSection | null
  onSave: () => void | Promise<void>
  onPublish: () => void | Promise<void>
  onCollapse: () => void
  onRequestDelete: (sectionId: string) => void
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  const tag = target.tagName
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  )
}

export function useEditorShortcuts({
  enabled = true,
  preferSaveOverPublish = false,
  expandedSection,
  onSave,
  onPublish,
  onCollapse,
  onRequestDelete,
}: UseEditorShortcutsOptions) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey

      if (meta && event.key.toLowerCase() === "s") {
        event.preventDefault()
        // Spec: Ctrl/Cmd+S publishes; save draft when publish isn't appropriate.
        if (preferSaveOverPublish) {
          void onSave()
        } else {
          void onPublish()
        }
        return
      }

      if (meta && event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault()
        void onPublish()
        return
      }

      if (event.key === "Escape") {
        onCollapse()
        return
      }

      if (
        event.key === "Delete" &&
        !isEditableTarget(event.target) &&
        expandedSection &&
        canDeleteSection(expandedSection)
      ) {
        event.preventDefault()
        onRequestDelete(expandedSection.id)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [
    enabled,
    preferSaveOverPublish,
    expandedSection,
    onSave,
    onPublish,
    onCollapse,
    onRequestDelete,
  ])
}
