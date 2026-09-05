import { Link } from "react-router-dom"
import { Building2 } from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { CompanyForm } from "@/features/company/components/company-form"
import { CompanyFormSkeleton } from "@/features/company/components/company-form-skeleton"
import { useCompanyQuery } from "@/features/company/hooks/use-company-query"
import { useUpdateCompanyMutation } from "@/features/company/hooks/use-update-company-mutation"
import type { CompanyFormParsed } from "@/features/company/schemas/company-schema"
import { getErrorMessage } from "@/lib/toast"
import { useWorkspace } from "@/providers/workspace-provider"
import { ApiError } from "@/api/client"
import { routes } from "@/routes/paths"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function CompanyPage() {
  const { companyId, hasCompany } = useWorkspace()
  const companyQuery = useCompanyQuery(companyId)
  const updateMutation = useUpdateCompanyMutation(companyId ?? "")

  const handleUpdate = async (values: CompanyFormParsed) => {
    await updateMutation.mutateAsync(values)
    toast.success("Company branding saved")
  }

  if (!hasCompany || !companyId) {
    return (
      <PageContainer>
        <PageHeader
          title="Company"
          description="Manage branding, profile details, and career-site identity."
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
          badge={<PageBadge label="Branding" />}
          title="Company"
          description="Manage branding, profile details, and career-site identity."
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
          description="Manage branding, profile details, and career-site identity."
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

  if (!companyQuery.data) {
    return (
      <PageContainer>
        <PageHeader
          title="Company"
          description="Manage branding, profile details, and career-site identity."
        />
        <ErrorState
          title="Company not found"
          message="Could not load your company."
          onRetry={() => void companyQuery.refetch()}
        />
      </PageContainer>
    )
  }

  const company = companyQuery.data

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        badge={
          <PageBadge
            label={company.is_active ? "Active" : "Inactive"}
            tone={company.is_active ? "success" : "muted"}
          />
        }
        title={
          <>
            Company{" "}
            <span className="text-primary">{company.name}</span>
          </>
        }
        description="Manage branding, profile details, and career-site identity."
        actions={
          company.slug ? (
            <Button asChild variant="outline" size="sm">
              <Link to={routes.publicCareers(company.slug)} target="_blank">
                View public site
              </Link>
            </Button>
          ) : null
        }
      />

      <CompanyForm
        mode="edit"
        company={company}
        isSubmitting={updateMutation.isPending}
        onSubmit={handleUpdate}
      />
    </PageContainer>
  )
}

function PageBadge({
  label,
  tone = "teal",
}: {
  label: string
  tone?: "teal" | "success" | "muted"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "success" &&
          "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        tone === "teal" &&
          "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
        tone === "muted" && "bg-muted text-muted-foreground",
      )}
    >
      <Building2 className="size-3" aria-hidden />
      {label}
    </span>
  )
}
