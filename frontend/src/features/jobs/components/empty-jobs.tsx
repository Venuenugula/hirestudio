import { BriefcaseBusiness } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

type EmptyJobsProps = {
  hasFilters?: boolean
  onCreate?: () => void
  onClearFilters?: () => void
}

export function EmptyJobs({
  hasFilters = false,
  onCreate,
  onClearFilters,
}: EmptyJobsProps) {
  if (hasFilters) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title="No jobs match your filters"
        description="Try adjusting search or filter criteria."
        action={
          onClearFilters ? (
            <Button type="button" variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          ) : undefined
        }
      />
    )
  }

  return (
    <EmptyState
      icon={BriefcaseBusiness}
      title="No jobs yet"
      description="Create your first open role. Active jobs appear in the careers page preview."
      action={
        onCreate ? (
          <Button type="button" onClick={onCreate}>
            Create job
          </Button>
        ) : undefined
      }
    />
  )
}
