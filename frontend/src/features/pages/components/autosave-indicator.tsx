import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Check, CloudOff, Loader2 } from "lucide-react"

import type { AutosaveStatus } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type AutosaveIndicatorProps = {
  status: AutosaveStatus
  className?: string
}

function labelFor(status: AutosaveStatus) {
  switch (status) {
    case "dirty":
      return "Unsaved Changes"
    case "saving":
      return "Saving..."
    case "saved":
      return "Saved"
    case "error":
      return "Save Failed"
    default:
      return null
  }
}

export function AutosaveIndicator({ status, className }: AutosaveIndicatorProps) {
  const label = labelFor(status)
  const visible = status !== "idle"

  return (
    <div
      className={cn(
        "pointer-events-none fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {visible && label ? (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "pointer-events-auto inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-sm",
              status === "error"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : status === "dirty"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
                  : "border-border bg-card/95 text-foreground",
            )}
            role="status"
            aria-live="polite"
          >
            {status === "saving" ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : null}
            {status === "saved" ? (
              <Check className="size-3.5 text-emerald-600" aria-hidden />
            ) : null}
            {status === "dirty" ? (
              <CloudOff className="size-3.5" aria-hidden />
            ) : null}
            {status === "error" ? (
              <AlertCircle className="size-3.5" aria-hidden />
            ) : null}
            {label}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
