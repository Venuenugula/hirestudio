import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { getPublicSite } from "@/features/public/api/public-api"

export function usePublicSiteQuery(slug: string | undefined) {
  return useQuery({
    queryKey: slug
      ? queryKeys.public.site(slug)
      : queryKeys.public.site("none"),
    queryFn: () => getPublicSite(slug!),
    enabled: Boolean(slug),
  })
}
