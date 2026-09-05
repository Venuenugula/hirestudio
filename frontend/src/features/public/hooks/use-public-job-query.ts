import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/api/query-keys"
import { getPublicJob } from "@/features/public/api/public-api"

export function usePublicJobQuery(
  slug: string | undefined,
  jobId: string | undefined,
) {
  return useQuery({
    queryKey:
      slug && jobId
        ? queryKeys.public.job(slug, jobId)
        : queryKeys.public.job("none", "none"),
    queryFn: () => getPublicJob(slug!, jobId!),
    enabled: Boolean(slug && jobId),
  })
}
