import { Link } from "react-router-dom"
import { FileStack } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { routes } from "@/routes/paths"

export function EmptyPage() {
  return (
    <EmptyState
      icon={FileStack}
      title="No active company"
      description="Create or select a company first. The careers page builder uses the temporary workspace company id."
      action={
        <Button asChild>
          <Link to={routes.company}>Go to Company</Link>
        </Button>
      }
    />
  )
}
