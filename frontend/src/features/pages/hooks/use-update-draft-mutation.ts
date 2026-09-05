import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { updateCareersPageDraft } from "@/features/pages/api/careers-page-api"
import type { PageConfig } from "@/features/pages/types"
import { toastError } from "@/lib/toast"

type Options = {
  silent?: boolean
}

export function useUpdateDraftMutation(companyId: string, options: Options = {}) {
  const queryClient = useQueryClient()
  const silent = options.silent ?? false

  return useMutation({
    mutationFn: (draftConfig: PageConfig) =>
      updateCareersPageDraft(companyId, draftConfig),
    onSuccess: (page) => {
      queryClient.setQueryData(queryKeys.careersPage.byCompany(companyId), page)
    },
    onError: (error) => {
      if (!silent) {
        toastError(error, "Failed to save draft")
      }
    },
  })
}
