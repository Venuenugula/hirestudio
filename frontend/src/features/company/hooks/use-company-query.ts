import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { getMyCompany } from "@/features/company/api/company-api"

export function useCompanyQuery(companyId: string | null) {
  return useQuery({
    queryKey: companyId
      ? queryKeys.companies.detail(companyId)
      : queryKeys.companies.me,
    queryFn: () => getMyCompany(),
    enabled: Boolean(companyId),
  })
}
