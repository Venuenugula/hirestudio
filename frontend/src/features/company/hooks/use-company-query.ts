import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { getCompanyById } from "@/features/company/api/company-api"

export function useCompanyQuery(companyId: string | null) {
  return useQuery({
    queryKey: companyId
      ? queryKeys.companies.detail(companyId)
      : (["companies", "none"] as const),
    queryFn: () => {
      if (!companyId) {
        throw new Error("Company id is required")
      }
      return getCompanyById(companyId)
    },
    enabled: Boolean(companyId),
  })
}
