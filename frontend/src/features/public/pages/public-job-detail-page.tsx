import { useParams } from "react-router-dom"

import { ApiError } from "@/api/client"
import type { Company } from "@/features/company/types"
import type { Job } from "@/features/jobs/types"
import type { PageTheme } from "@/features/pages/types"
import { PublicErrorPage } from "@/features/public/components/public-error-page"
import { PublicFooter } from "@/features/public/components/public-footer"
import { PublicJobDetail } from "@/features/public/components/public-job-detail"
import { PublicShell } from "@/features/public/components/public-shell"
import { PublicJobDetailSkeleton } from "@/features/public/components/public-skeletons"
import { useDocumentMeta } from "@/features/public/hooks/use-document-meta"
import { usePublicJobQuery } from "@/features/public/hooks/use-public-job-query"
import { usePublicSiteQuery } from "@/features/public/hooks/use-public-site-query"
import { resolvePublicTheme } from "@/features/public/lib/theme"

export function PublicJobDetailPage() {
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>()
  const jobQuery = usePublicJobQuery(slug, jobId)
  // Reuses cached site query for published theme when navigated from the careers page.
  const siteQuery = usePublicSiteQuery(slug)

  if (!slug || !jobId) {
    return (
      <PublicErrorPage
        title="Invalid link"
        message="This job URL is missing a company slug or job id."
      />
    )
  }

  if (jobQuery.isLoading) {
    return <PublicJobDetailSkeleton />
  }

  if (jobQuery.isError || !jobQuery.data) {
    const isNotFound =
      jobQuery.error instanceof ApiError && jobQuery.error.status === 404

    return (
      <PublicErrorPage
        title={isNotFound ? "Job not found" : "Something went wrong"}
        message={
          isNotFound
            ? "This role is no longer available or does not exist."
            : jobQuery.error instanceof Error
              ? jobQuery.error.message
              : "Failed to load this job."
        }
        onRetry={isNotFound ? undefined : () => void jobQuery.refetch()}
      />
    )
  }

  const { company, job } = jobQuery.data
  const theme = resolvePublicTheme(
    siteQuery.data?.careers_page?.published_config ?? null,
    company,
  )

  return (
    <PublicJobDetailContent
      slug={slug}
      company={company}
      job={job}
      theme={theme}
    />
  )
}

function PublicJobDetailContent({
  slug,
  company,
  job,
  theme,
}: {
  slug: string
  company: Company
  job: Job
  theme: PageTheme
}) {
  useDocumentMeta({
    title: `${job.title} · ${company.name}`,
    description: `${job.title} — ${job.department}, ${job.location} at ${company.name}.`,
  })

  return (
    <PublicShell company={company} theme={theme}>
      <PublicJobDetail job={job} slug={slug} companyName={company.name} />
      <PublicFooter companyName={company.name} />
    </PublicShell>
  )
}
