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
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
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
        <Card>
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
