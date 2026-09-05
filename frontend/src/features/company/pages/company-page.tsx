import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { CompanyDetailsCard } from "@/features/company/components/company-details-card"
import { CompanyForm } from "@/features/company/components/company-form"
import { CompanyFormSkeleton } from "@/features/company/components/company-form-skeleton"
import { useCompanyQuery } from "@/features/company/hooks/use-company-query"
import { useCreateCompanyMutation } from "@/features/company/hooks/use-create-company-mutation"
import { useUpdateCompanyMutation } from "@/features/company/hooks/use-update-company-mutation"
import type { CompanyFormParsed } from "@/features/company/schemas/company-schema"
import { getErrorMessage } from "@/lib/toast"
import { useWorkspace } from "@/providers/workspace-provider"
import { ApiError } from "@/api/client"

export function CompanyPage() {
  const { companyId, clearCompanyId, hasCompany } = useWorkspace()
  const companyQuery = useCompanyQuery(companyId)
  const createMutation = useCreateCompanyMutation()
  const updateMutation = useUpdateCompanyMutation(companyId ?? "")

  const handleCreate = async (values: CompanyFormParsed) => {
    await createMutation.mutateAsync(values)
  }

  const handleUpdate = async (values: CompanyFormParsed) => {
    if (!companyId) {
      return
    }
    await updateMutation.mutateAsync(values)
  }

  if (hasCompany && companyQuery.isLoading) {
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

  if (hasCompany && companyQuery.isError) {
    const isNotFound =
      companyQuery.error instanceof ApiError && companyQuery.error.status === 404

    return (
      <PageContainer>
        <PageHeader
          title="Company"
          description="Manage tenant branding, slug, and theme colors."
        />
        <ErrorState
          title={isNotFound ? "Company not found" : "Failed to load company"}
          message={getErrorMessage(
            companyQuery.error,
            "Could not load the active company.",
          )}
          action={
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void companyQuery.refetch()}
              >
                Try again
              </Button>
              {isNotFound ? (
                <Button type="button" onClick={clearCompanyId}>
                  Create a new company
                </Button>
              ) : null}
            </div>
          }
        />
      </PageContainer>
    )
  }

  const company = companyQuery.data
  const isEditMode = Boolean(companyId && company)

  return (
    <PageContainer>
      <PageHeader
        title="Company"
        description="Manage tenant branding, slug, and theme colors."
        actions={
          isEditMode ? (
            <Button type="button" variant="outline" onClick={clearCompanyId}>
              Create another
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <CompanyForm
          mode={isEditMode ? "edit" : "create"}
          company={company}
          isSubmitting={
            isEditMode ? updateMutation.isPending : createMutation.isPending
          }
          onSubmit={isEditMode ? handleUpdate : handleCreate}
        />

        {company ? <CompanyDetailsCard company={company} /> : null}
      </div>
    </PageContainer>
  )
}
