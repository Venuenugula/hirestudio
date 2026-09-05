import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { CompanyDetailsCard } from "@/features/company/components/company-details-card"
import { CompanyForm } from "@/features/company/components/company-form"
import { CompanyFormSkeleton } from "@/features/company/components/company-form-skeleton"
import { useCompanyQuery } from "@/features/company/hooks/use-company-query"
import { useUpdateCompanyMutation } from "@/features/company/hooks/use-update-company-mutation"
import type { CompanyFormParsed } from "@/features/company/schemas/company-schema"
import { getErrorMessage } from "@/lib/toast"
import { useWorkspace } from "@/providers/workspace-provider"
import { ApiError } from "@/api/client"
import { Link } from "react-router-dom"
import { routes } from "@/routes/paths"

export function CompanyPage() {
  const { companyId, hasCompany } = useWorkspace()
  const companyQuery = useCompanyQuery(companyId)
  const updateMutation = useUpdateCompanyMutation(companyId ?? "")

  const handleUpdate = async (values: CompanyFormParsed) => {
    await updateMutation.mutateAsync(values)
  }

  if (!hasCompany || !companyId) {
    return (
      <PageContainer>
        <PageHeader
          title="Company"
          description="Manage tenant branding, slug, and theme colors."
        />
        <ErrorState
          title="No company linked"
          message="Your account should include a company. Try signing in again."
          action={
            <Button asChild>
              <Link to={routes.login}>Go to login</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  if (companyQuery.isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Company"
          description="Manage tenant branding, slug, and theme colors."
        />
        <CompanyFormSkeleton />
      </PageContainer>
    )
  }

  if (companyQuery.isError) {
    return (
      <PageContainer>
        <PageHeader
          title="Company"
          description="Manage tenant branding, slug, and theme colors."
        />
        <ErrorState
          title={
            companyQuery.error instanceof ApiError &&
            companyQuery.error.status === 404
              ? "Company not found"
              : "Failed to load company"
          }
          message={getErrorMessage(
            companyQuery.error,
            "Could not load your company.",
          )}
          onRetry={() => void companyQuery.refetch()}
        />
      </PageContainer>
    )
  }

  const company = companyQuery.data

  return (
    <PageContainer>
      <PageHeader
        title="Company"
        description="Manage tenant branding, slug, and theme colors."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <CompanyForm
          mode="edit"
          company={company}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleUpdate}
        />

        {company ? <CompanyDetailsCard company={company} /> : null}
      </div>
    </PageContainer>
  )
}
