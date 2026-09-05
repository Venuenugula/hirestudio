import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createJob } from "@/features/jobs/api/jobs-api"
import type { Job, JobCreatePayload, JobListResponse } from "@/features/jobs/types"
import { toastError, toastSuccess } from "@/lib/toast"

export function useCreateJobMutation(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: JobCreatePayload) => createJob(companyId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: ["jobs", "company", companyId],
      })

      const optimisticJob: Job = {
        id: `temp-${crypto.randomUUID()}`,
        company_id: companyId,
        title: payload.title,
        department: payload.department,
        location: payload.location,
        employment_type: payload.employment_type,
        description: payload.description,
        is_active: payload.is_active,
        application_url: payload.application_url ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const previous = queryClient.getQueriesData<JobListResponse>({
        queryKey: ["jobs", "company", companyId],
      })

      previous.forEach(([key, data]) => {
        if (!data) {
          return
        }
        queryClient.setQueryData<JobListResponse>(key, {
          items: [optimisticJob, ...data.items],
          total: data.total + 1,
        })
      })

      return { previous }
    },
    onError: (error, _payload, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toastError(error, "Failed to create job")
    },
    onSuccess: () => {
      toastSuccess("Job created")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["jobs", "company", companyId],
      })
    },
  })
}
