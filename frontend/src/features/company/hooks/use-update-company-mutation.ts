import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { updateMyCompany } from "@/features/company/api/company-api"
import type { CompanyUpdatePayload } from "@/features/company/types"
import { toastError, toastSuccess } from "@/lib/toast"
import { useAuth } from "@/providers/auth-provider"

export function useUpdateCompanyMutation(_companyId: string) {
  const queryClient = useQueryClient()
  const { setCompany } = useAuth()

  return useMutation({
    mutationFn: (payload: CompanyUpdatePayload) => updateMyCompany(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.companies.detail(updated.id), updated)
      queryClient.setQueryData(queryKeys.companies.me, updated)
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.all })
      setCompany(updated)
      toastSuccess("Company updated")
    },
    onError: (error) => {
      toastError(error, "Failed to update company")
    },
  })
}
