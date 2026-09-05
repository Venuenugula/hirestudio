import { ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

import {
  formatJobLabel,
  formatRelativePostedAt,
} from "@/features/jobs/constants"
import type { Job } from "@/features/jobs/types"
import { routes } from "@/routes/paths"

type PublicJobDetailProps = {
  job: Job
  slug: string
  companyName: string
}

export function PublicJobDetail({
  job,
  slug,
  companyName,
}: PublicJobDetailProps) {
  const details = [
    { label: "Department", value: job.department },
    { label: "Location", value: job.location },
    { label: "Work policy", value: formatJobLabel(job.work_policy) },
    { label: "Employment", value: formatJobLabel(job.employment_type) },
    { label: "Job type", value: formatJobLabel(job.job_type) },
    { label: "Experience", value: formatJobLabel(job.experience_level) },
    {
      label: "Compensation",
      value: job.salary_range ?? "Not specified",
    },
    { label: "Posted", value: formatRelativePostedAt(job.posted_at) },
  ]

  return (
    <article className="px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <Link
            to={routes.publicCareers(slug)}
            className="inline-block text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            ← Back to {companyName} careers
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {job.title}
          </h1>
          <p className="text-sm opacity-75 md:text-base">
            {job.department} · {job.location} · {formatJobLabel(job.work_policy)}
          </p>
        </div>

        <dl className="grid gap-4 border-t border-black/10 pt-8 sm:grid-cols-2">
          {details.map((item) => (
            <div key={item.label} className="space-y-1">
              <dt className="text-xs font-medium tracking-wide uppercase opacity-60">
                {item.label}
              </dt>
              <dd className="text-sm md:text-base">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-3 border-t border-black/10 pt-8">
          <h2 className="text-lg font-semibold">About the role</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed opacity-85 md:text-base">
            {job.description}
          </p>
        </div>

        {job.application_url ? (
          <a
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--public-primary)",
              color: "var(--public-secondary)",
            }}
          >
            Apply now
            <ExternalLink className="size-4" aria-hidden />
          </a>
        ) : null}
      </div>
    </article>
  )
}
