import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { publishCareersPage } from "@/features/pages/api/careers-page-api"
import { toastError, toastSuccess } from "@/lib/toast"

export function usePublishCareersPageMutation(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => publishCareersPage(companyId),
    onSuccess: (page) => {
      queryClient.setQueryData(queryKeys.careersPage.byCompany(companyId), page)
      toastSuccess("Careers page published")
    },
    onError: (error) => {
      toastError(error, "Failed to publish careers page")
    },
  })
}
