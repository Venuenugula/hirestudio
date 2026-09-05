import { Link } from "react-router-dom"
import { useMemo, useState } from "react"
import { Briefcase, Plus } from "lucide-react"

import { ErrorState } from "@/components/shared/error-state"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DeleteJobDialog } from "@/features/jobs/components/delete-job-dialog"
import { EmptyJobs } from "@/features/jobs/components/empty-jobs"
import { JobFiltersBar } from "@/features/jobs/components/job-filters"
import { JobFormDialog } from "@/features/jobs/components/job-form-dialog"
import { JobsTable } from "@/features/jobs/components/jobs-table"
import { useCreateJobMutation } from "@/features/jobs/hooks/use-create-job-mutation"
import { useDeleteJobMutation } from "@/features/jobs/hooks/use-delete-job-mutation"
import { useJobsQuery } from "@/features/jobs/hooks/use-jobs-query"
import { useUpdateJobMutation } from "@/features/jobs/hooks/use-update-job-mutation"
import type { JobFormParsed } from "@/features/jobs/schemas/job-schema"
import type { Job, JobFilters } from "@/features/jobs/types"
import { getErrorMessage } from "@/lib/toast"
import { useWorkspace } from "@/providers/workspace-provider"
import { routes } from "@/routes/paths"

const EMPTY_FILTERS: JobFilters = {
  title: "",
  department: "",
  location: "",
  employment_type: undefined,
  work_policy: undefined,
  experience_level: undefined,
  job_type: undefined,
  is_active: null,
}

export function JobsPage() {
  const { companyId, hasCompany } = useWorkspace()
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const jobsQuery = useJobsQuery(companyId, filters)
  const createMutation = useCreateJobMutation(companyId ?? "")
  const updateMutation = useUpdateJobMutation(companyId ?? "")
  const deleteMutation = useDeleteJobMutation(companyId ?? "")

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.title?.trim() ||
        filters.department?.trim() ||
        filters.location?.trim() ||
        filters.employment_type ||
        filters.work_policy ||
        filters.experience_level ||
        filters.job_type ||
        filters.is_active === true ||
        filters.is_active === false,
    )
  }, [filters])

  if (!hasCompany || !companyId) {
    return (
      <PageContainer>
        <PageHeader
          title="Jobs"
          description="Create and manage open roles for the public careers page."
        />
        <EmptyJobs />
        <div className="mt-4">
          <Button asChild>
            <Link to={routes.company}>Go to Company</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  const openCreate = () => {
    setFormMode("create")
    setSelectedJob(null)
    setFormOpen(true)
  }

  const openEdit = (job: Job) => {
    setFormMode("edit")
    setSelectedJob(job)
    setFormOpen(true)
  }

  const openDelete = (job: Job) => {
    setSelectedJob(job)
    setDeleteOpen(true)
  }

  const handleSubmit = async (values: JobFormParsed) => {
    if (formMode === "create") {
      await createMutation.mutateAsync(values)
      return
    }
    if (!selectedJob) {
      return
    }
    await updateMutation.mutateAsync({
      jobId: selectedJob.id,
      payload: values,
    })
  }

  const jobs = jobsQuery.data?.items ?? []
  const activeCount = jobs.filter((job) => job.is_active).length

  return (
    <PageContainer className="max-w-7xl">
      <PageHeader
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            <Briefcase className="size-3" aria-hidden />
            {jobsQuery.isSuccess
              ? `${activeCount} active · ${jobs.length} shown`
              : "Open roles"}
          </span>
        }
        title="Jobs"
        description="Create and manage open roles for the public careers page."
        actions={
          <Button type="button" onClick={openCreate}>
            <Plus className="size-4" />
            Create job
          </Button>
        }
      />

      <Card className="gap-0 overflow-hidden py-0 shadow-sm">
        <CardContent className="space-y-4 p-5">
          <JobFiltersBar value={filters} onChange={setFilters} />

          {jobsQuery.isLoading ? <LoadingSpinner label="Loading jobs" /> : null}

          {jobsQuery.isError ? (
            <ErrorState
              message={getErrorMessage(jobsQuery.error, "Failed to load jobs")}
              onRetry={() => void jobsQuery.refetch()}
            />
          ) : null}

          {jobsQuery.isSuccess && jobs.length === 0 ? (
            <EmptyJobs
              hasFilters={hasActiveFilters}
              onCreate={openCreate}
              onClearFilters={() => setFilters(EMPTY_FILTERS)}
            />
          ) : null}

          {jobsQuery.isSuccess && jobs.length > 0 ? (
            <JobsTable jobs={jobs} onEdit={openEdit} onDelete={openDelete} />
          ) : null}
        </CardContent>
      </Card>

      <JobFormDialog
        open={formOpen}
        mode={formMode}
        job={selectedJob}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <DeleteJobDialog
        open={deleteOpen}
        job={selectedJob}
        isDeleting={deleteMutation.isPending}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          if (!selectedJob) {
            return
          }
          await deleteMutation.mutateAsync(selectedJob.id)
        }}
      />
    </PageContainer>
  )
}
