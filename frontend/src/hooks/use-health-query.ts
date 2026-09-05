import { useQuery } from "@tanstack/react-query"

import { getHealth } from "@/api/health"
import { queryKeys } from "@/api/query-keys"

export function useHealthQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: getHealth,
    enabled,
  })
}
