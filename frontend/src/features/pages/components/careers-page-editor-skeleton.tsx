import { Skeleton } from "@/components/ui/skeleton"

export function CareersPageEditorSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-[28rem] w-full rounded-xl" />
        <Skeleton className="h-[28rem] w-full rounded-xl" />
      </div>
    </div>
  )
}
