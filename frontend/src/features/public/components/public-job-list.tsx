import { useState } from "react"
import { Briefcase } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import type { OpenRolesSection } from "@/features/pages/types"
import type { Job } from "@/features/jobs/types"
import { PublicJobCard } from "@/features/public/components/public-job-card"
import {
  PublicJobSearchPanel,
  useFilteredPublicJobs,
} from "@/features/public/components/public-job-search-panel"
import {
  EMPTY_PUBLIC_JOB_FILTERS,
  POPULAR_SEARCHES,
  type PublicJobFilters,
} from "@/features/public/lib/job-search"

type PublicJobListProps = {
  jobs: Job[]
  slug: string
  companyName: string
  section?: Pick<OpenRolesSection, "title" | "subtitle" | "variant">
  disableNavigation?: boolean
}

export function PublicJobList({
  jobs,
  slug,
  companyName,
  section,
  disableNavigation = false,
}: PublicJobListProps) {
  const [filters, setFilters] = useState<PublicJobFilters>(EMPTY_PUBLIC_JOB_FILTERS)
  const filteredJobs = useFilteredPublicJobs(jobs, filters)
  const layout = section?.variant ?? "cards"

  const title = section?.title || "Open roles"
  const subtitle = section?.subtitle
  const tryTerms = [
    ...POPULAR_SEARCHES.slice(0, 4),
    ...[...new Set(jobs.map((job) => job.location.split(",")[0]?.trim()).filter(Boolean))]
      .slice(0, 2),
  ].filter((term, index, list) => list.indexOf(term) === index).slice(0, 6)

  return (
    <section
      id="open-roles"
      className="scroll-mt-8 border-t border-[var(--public-border)] px-4 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-foreground)] md:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="max-w-2xl text-sm text-[var(--public-muted)] md:text-base">
              {subtitle}
            </p>
          ) : null}
          <p className="text-sm text-[var(--public-muted)]">
            {jobs.length} open {jobs.length === 1 ? "position" : "positions"}
          </p>
        </div>

        {jobs.length > 0 ? (
          <PublicJobSearchPanel
            jobs={jobs}
            filters={filters}
            onChange={setFilters}
            resultCount={filteredJobs.length}
          />
        ) : null}

        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No open positions right now"
            description="Check back soon — new roles are posted regularly."
            className="border-[var(--public-border)] bg-[var(--public-surface)]"
          />
        ) : filteredJobs.length === 0 ? (
          <div className="space-y-4 rounded-2xl border border-dashed border-[var(--public-border)] bg-[var(--public-surface)] px-6 py-12 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-[var(--public-hover)] text-[var(--public-primary)]">
              <Briefcase className="size-5" aria-hidden />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[var(--public-foreground)]">
                No jobs matched
              </h3>
              <p className="text-sm text-[var(--public-muted)]">
                Try a different keyword, clear filters, or pick a suggestion below.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {tryTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="rounded-full border border-[var(--public-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--public-foreground)] transition-colors hover:border-[var(--public-accent)] hover:bg-[var(--public-hover)]"
                  onClick={() =>
                    setFilters({ ...EMPTY_PUBLIC_JOB_FILTERS, query: term })
                  }
                >
                  {term}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="text-sm font-medium text-[var(--public-primary)] underline-offset-2 hover:underline"
              onClick={() => setFilters(EMPTY_PUBLIC_JOB_FILTERS)}
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul
            className={
              layout === "list" ? "space-y-3" : "grid gap-4 md:grid-cols-2"
            }
          >
            {filteredJobs.map((job) => (
              <PublicJobCard
                key={job.id}
                job={job}
                slug={slug}
                companyName={companyName}
                searchQuery={filters.query}
                disableNavigation={disableNavigation}
                layout={layout}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
