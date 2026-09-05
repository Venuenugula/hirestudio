import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  COMING_SOON_SECTION_TYPES,
  SUPPORTED_SECTION_TYPES,
  sectionLabel,
} from "@/features/pages/lib/page-config"
import { SECTION_ICONS } from "@/features/pages/lib/section-icons"
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
        <ul className="grid gap-2 sm:grid-cols-2">
          {SUPPORTED_SECTION_TYPES.map((type) => {
            const Icon = SECTION_ICONS[type]
            return (
              <li key={type}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border border-border px-3 py-3 text-left transition-colors hover:bg-accent",
                  )}
                  onClick={() => {
                    onAdd(type)
                    setOpen(false)
                  }}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">{sectionLabel(type)}</span>
                </button>
              </li>
            )
          })}
          {COMING_SOON_SECTION_TYPES.map((type) => {
            const Icon = SECTION_ICONS[type]
            return (
              <li key={type}>
                <div className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border px-3 py-3 opacity-70">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {sectionLabel(type)}
                    </p>
                    <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Coming soon
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Dialog>
    </>
  )
}
