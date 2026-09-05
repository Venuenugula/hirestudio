import type { OpenRolesSection } from "@/features/pages/types"
import type { Job } from "@/features/jobs/types"
import { PublicJobCard } from "@/features/public/components/public-job-card"

type PublicJobListProps = {
  jobs: Job[]
  slug: string
  section?: Pick<OpenRolesSection, "title" | "subtitle">
}

export function PublicJobList({ jobs, slug, section }: PublicJobListProps) {
  const title = section?.title || "Open roles"
  const subtitle = section?.subtitle

  return (
    <section
      id="open-roles"
      className="scroll-mt-8 border-t border-black/10 px-4 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          {subtitle ? <p className="text-sm opacity-75">{subtitle}</p> : null}
          <p className="text-sm opacity-75">
            {jobs.length === 0
              ? "No open positions right now. Check back soon."
              : `${jobs.length} open ${jobs.length === 1 ? "position" : "positions"}`}
          </p>
        </div>

        {jobs.length > 0 ? (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <PublicJobCard key={job.id} job={job} slug={slug} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
