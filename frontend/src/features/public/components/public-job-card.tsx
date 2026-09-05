import { Link } from "react-router-dom"

import {
  formatJobLabel,
  formatRelativePostedAt,
} from "@/features/jobs/constants"
import type { Job } from "@/features/jobs/types"
import { routes } from "@/routes/paths"

type PublicJobCardProps = {
  job: Job
  slug: string
}

export function PublicJobCard({ job, slug }: PublicJobCardProps) {
  return (
    <li>
      <Link
        to={routes.publicJob(slug, job.id)}
        className="block rounded-lg border border-black/10 px-4 py-4 transition-colors hover:border-black/25"
        style={{
          borderColor: "color-mix(in oklab, currentColor 15%, transparent)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="font-medium">{job.title}</p>
          <p className="text-xs opacity-60">
            {formatRelativePostedAt(job.posted_at)}
          </p>
        </div>
        <p className="mt-1 text-sm opacity-75">
          {job.department} · {job.location} · {formatJobLabel(job.work_policy)}
        </p>
        <p className="mt-1 text-sm opacity-70">
          {formatJobLabel(job.experience_level)} ·{" "}
          {formatJobLabel(job.employment_type)} · {formatJobLabel(job.job_type)}
          {job.salary_range ? ` · ${job.salary_range}` : ""}
        </p>
      </Link>
    </li>
  )
}
