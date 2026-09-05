import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type LoadingSpinnerProps = {
  label?: string
  className?: string
}

export function LoadingSpinner({
  label = "Loading",
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-3 text-muted-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-6 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  )
}
