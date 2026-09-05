import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteJob } from "@/features/jobs/api/jobs-api"
import type { JobListResponse } from "@/features/jobs/types"
import { toastError, toastSuccess } from "@/lib/toast"

export function useDeleteJobMutation(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({
        queryKey: ["jobs", "company", companyId],
      })

      const previous = queryClient.getQueriesData<JobListResponse>({
        queryKey: ["jobs", "company", companyId],
      })

      previous.forEach(([key, data]) => {
        if (!data) {
          return
        }
        queryClient.setQueryData<JobListResponse>(key, {
          items: data.items.filter((job) => job.id !== jobId),
          total: Math.max(0, data.total - 1),
        })
      })

      return { previous }
    },
    onError: (error, _jobId, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toastError(error, "Failed to delete job")
    },
    onSuccess: () => {
      toastSuccess("Job deleted")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["jobs", "company", companyId],
      })
    },
  })
}
