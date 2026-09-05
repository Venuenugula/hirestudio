import { Link } from "react-router-dom"

import { formatEmploymentType } from "@/features/jobs/components/job-filters"
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
        <p className="font-medium">{job.title}</p>
        <p className="mt-1 text-sm opacity-75">
          {job.department} · {job.location} ·{" "}
          {formatEmploymentType(job.employment_type)}
        </p>
      </Link>
    </li>
  )
}
