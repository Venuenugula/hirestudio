import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { routes } from "@/routes/paths"

type PublicErrorPageProps = {
  title?: string
  message: string
  onRetry?: () => void
}

export function PublicErrorPage({
  title = "Page not found",
  message,
  onRetry,
}: PublicErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
        <Button asChild variant="secondary">
          <Link to={routes.home}>Go home</Link>
        </Button>
      </div>
    </div>
  )
}
