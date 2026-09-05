import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { updateCompany } from "@/features/company/api/company-api"
import type { CompanyUpdatePayload } from "@/features/company/types"
import { toastError, toastSuccess } from "@/lib/toast"

export function useUpdateCompanyMutation(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CompanyUpdatePayload) =>
      updateCompany(companyId, payload),
    onSuccess: (company) => {
      queryClient.setQueryData(queryKeys.companies.detail(company.id), company)
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.all })
      toastSuccess("Company updated")
    },
    onError: (error) => {
      toastError(error, "Failed to update company")
    },
  })
}
