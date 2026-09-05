import { Link } from "react-router-dom"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useHealthQuery } from "@/hooks/use-health-query"
import { routes } from "@/routes/paths"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { ErrorState } from "@/components/shared/error-state"
import { getErrorMessage } from "@/lib/toast"

export function HomePage() {
  const healthQuery = useHealthQuery()

  return (
    <PageContainer>
      <PageHeader
        title="Career Page Builder"
        description="Frontend foundation is ready. Feature modules will plug into this shell."
        actions={
          <Button asChild>
            <Link to={routes.dashboard}>Open dashboard</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>API connectivity</CardTitle>
          <CardDescription>
            Sample TanStack Query hook against <code>/api/v1/health</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {healthQuery.isLoading ? <LoadingSpinner label="Checking API" /> : null}
          {healthQuery.isError ? (
            <ErrorState
              message={getErrorMessage(healthQuery.error, "API is unreachable")}
              onRetry={() => void healthQuery.refetch()}
            />
          ) : null}
          {healthQuery.isSuccess ? (
            <p className="text-sm text-muted-foreground">
              Backend status:{" "}
              <span className="font-medium text-foreground">
                {healthQuery.data.status}
              </span>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
