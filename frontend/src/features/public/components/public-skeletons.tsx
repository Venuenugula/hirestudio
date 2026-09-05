import { Skeleton } from "@/components/ui/skeleton"

export function PublicSiteSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 md:px-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
      <div className="mx-auto max-w-3xl space-y-4 border-t border-border px-4 py-12 md:px-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function PublicJobDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 md:px-8">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="mt-8 h-40 w-full" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  )
}
