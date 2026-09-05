import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateJob } from "@/features/jobs/api/jobs-api"
import type { JobListResponse, JobUpdatePayload } from "@/features/jobs/types"
import { toastError, toastSuccess } from "@/lib/toast"

export function useUpdateJobMutation(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string
      payload: JobUpdatePayload
    }) => updateJob(jobId, payload),
    onMutate: async ({ jobId, payload }) => {
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
          ...data,
          items: data.items.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  ...payload,
                  application_url:
                    payload.application_url === undefined
                      ? job.application_url
                      : payload.application_url,
                  updated_at: new Date().toISOString(),
                }
              : job,
          ),
        })
      })

      return { previous }
    },
    onError: (error, _vars, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toastError(error, "Failed to update job")
    },
    onSuccess: () => {
      toastSuccess("Job updated")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["jobs", "company", companyId],
      })
    },
  })
}
