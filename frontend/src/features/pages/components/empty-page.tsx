import { Link } from "react-router-dom"
import { FileStack } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { routes } from "@/routes/paths"

export function EmptyPage() {
  return (
    <EmptyState
      icon={FileStack}
      title="Set up your company first"
      description="The careers page builder needs an active company workspace before you can edit sections."
      action={
        <Button asChild>
          <Link to={routes.company}>Go to Company</Link>
        </Button>
      }
    />
  )
}
