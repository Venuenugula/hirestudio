import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { getCareersPage } from "@/features/pages/api/careers-page-api"

export function useCareersPageQuery(companyId: string | null) {
  return useQuery({
    queryKey: companyId
      ? queryKeys.careersPage.byCompany(companyId)
      : (["careers-page", "none"] as const),
    queryFn: () => {
      if (!companyId) {
        throw new Error("Company id is required")
      }
      return getCareersPage(companyId)
    },
    enabled: Boolean(companyId),
  })
}
