import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { createCompany } from "@/features/company/api/company-api"
import type { CompanyCreatePayload } from "@/features/company/types"
import { toastError, toastSuccess } from "@/lib/toast"
import { useWorkspace } from "@/providers/workspace-provider"

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient()
  const { setCompanyId } = useWorkspace()

  return useMutation({
    mutationFn: (payload: CompanyCreatePayload) => createCompany(payload),
    onSuccess: (company) => {
      setCompanyId(company.id)
      queryClient.setQueryData(queryKeys.companies.detail(company.id), company)
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.all })
      toastSuccess("Company created")
    },
    onError: (error) => {
      toastError(error, "Failed to create company")
    },
  })
}
