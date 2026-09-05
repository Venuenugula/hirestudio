import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import type { Job } from "@/features/jobs/types"

type DeleteJobDialogProps = {
  open: boolean
  job: Job | null
  isDeleting?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
}

export function DeleteJobDialog({
  open,
  job,
  isDeleting = false,
  onOpenChange,
  onConfirm,
}: DeleteJobDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete job"
      description={
        job
          ? `Delete “${job.title}”? This cannot be undone.`
          : "Delete this job?"
      }
    >
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isDeleting}
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting || !job}
          onClick={async () => {
            await onConfirm()
            onOpenChange(false)
          }}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Dialog>
  )
}
