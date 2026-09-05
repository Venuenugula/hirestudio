import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CareersPageEditorSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="order-1 space-y-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="hidden h-40 w-full rounded-xl md:block" />
        </div>
        <div className="order-3 space-y-4 md:order-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="order-2 md:order-3">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[28rem] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
