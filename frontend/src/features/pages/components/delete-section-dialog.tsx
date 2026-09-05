import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { sectionLabel, sectionPreviewTitle } from "@/features/pages/lib/page-config"
import type { PageSection } from "@/features/pages/types"

type DeleteSectionDialogProps = {
  open: boolean
  section: PageSection | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteSectionDialog({
  open,
  section,
  onOpenChange,
  onConfirm,
}: DeleteSectionDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete section"
      description={
        section
          ? `Delete “${sectionLabel(section.type)} — ${sectionPreviewTitle(section)}”? This cannot be undone.`
          : "Delete this section?"
      }
    >
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={!section}
          onClick={() => {
            onConfirm()
            onOpenChange(false)
          }}
        >
          Delete
        </Button>
      </div>
    </Dialog>
  )
}
