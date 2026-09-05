import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  COMING_SOON_SECTION_TYPES,
  SUPPORTED_SECTION_TYPES,
  sectionLabel,
} from "@/features/pages/lib/page-config"
import type { SectionType } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type AddSectionDialogProps = {
  disabled?: boolean
  onAdd: (type: SectionType) => void
}

export function AddSectionDialog({ disabled, onAdd }: AddSectionDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Add Section
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Add Section"
        description="Choose a block to add to your careers page."
      >
        <ul className="space-y-2">
          {SUPPORTED_SECTION_TYPES.map((type) => (
            <li key={type}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border border-border px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-accent",
                )}
                onClick={() => {
                  onAdd(type)
                  setOpen(false)
                }}
              >
                <span>{sectionLabel(type)}</span>
                <Plus className="size-4 text-muted-foreground" />
              </button>
            </li>
          ))}
          {COMING_SOON_SECTION_TYPES.map((type) => (
            <li key={type}>
              <div className="flex w-full items-center justify-between rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted-foreground opacity-70">
                <span>{sectionLabel(type)}</span>
                <span className="text-xs font-medium tracking-wide uppercase">
                  Coming Soon
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  )
}
