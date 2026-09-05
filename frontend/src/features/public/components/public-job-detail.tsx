import { ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

import {
  formatJobLabel,
  formatRelativePostedAt,
} from "@/features/jobs/constants"
import type { Job } from "@/features/jobs/types"
import { parseJobDescriptionSections } from "@/features/public/lib/job-description"
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
  const sections = parseJobDescriptionSections(job.description)
  const metaChips = [
    formatJobLabel(job.work_policy),
    job.location,
    formatJobLabel(job.employment_type),
    formatJobLabel(job.experience_level),
  ]

  return (
    <article className="relative px-4 py-12 md:px-8 md:py-16 lg:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
        <div className="min-w-0 space-y-10 md:space-y-12">
          <header className="space-y-5">
            <Link
              to={routes.publicCareers(slug)}
              className="inline-flex text-sm font-medium text-[var(--public-muted)] transition-colors hover:text-[var(--public-primary)]"
            >
              ← Back to {companyName} careers
            </Link>

            <div className="space-y-4">
              <p className="text-sm font-medium tracking-wide text-[var(--public-primary)] uppercase">
                {companyName}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-[var(--public-foreground)] md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                {job.title}
              </h1>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-[var(--public-muted)] md:text-lg">
                {metaChips.map((chip, index) => (
                  <span key={`${chip}-${index}`} className="inline-flex items-center gap-2">
                    {index > 0 ? (
                      <span className="text-[var(--public-border)]" aria-hidden>
                        •
                      </span>
                    ) : null}
                    {chip}
                  </span>
                ))}
              </p>
              {job.salary_range ? (
                <p className="text-2xl font-semibold tracking-tight text-[var(--public-primary)] md:text-3xl">
                  {job.salary_range}
                </p>
              ) : null}
            </div>

            {job.application_url ? (
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 lg:hidden"
                style={{ backgroundColor: "var(--public-primary)" }}
              >
                Apply now
                <ExternalLink className="size-4" aria-hidden />
              </a>
            ) : null}
          </header>

          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--public-foreground)] md:text-[1.75rem]">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-8 whitespace-pre-wrap text-[var(--public-muted)] md:text-[1.05rem] md:leading-8">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-5 rounded-2xl border border-[var(--public-border)] bg-[var(--public-surface)] p-5 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-wide text-[var(--public-muted)] uppercase">
                Role summary
              </p>
              <p className="text-sm font-medium text-[var(--public-foreground)]">
                {job.department}
              </p>
              <p className="text-sm text-[var(--public-muted)]">
                {formatJobLabel(job.job_type)} ·{" "}
                {formatRelativePostedAt(job.posted_at)}
              </p>
            </div>

            <dl className="space-y-3 border-t border-[var(--public-border)] pt-4 text-sm">
              <Detail label="Location" value={job.location} />
              <Detail
                label="Work policy"
                value={formatJobLabel(job.work_policy)}
              />
              <Detail
                label="Employment"
                value={formatJobLabel(job.employment_type)}
              />
              <Detail
                label="Experience"
                value={formatJobLabel(job.experience_level)}
              />
              <Detail
                label="Compensation"
                value={job.salary_range ?? "Not specified"}
              />
            </dl>

            {job.application_url ? (
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--public-primary)" }}
              >
                Apply now
                <ExternalLink className="size-4" aria-hidden />
              </a>
            ) : (
              <p className="rounded-xl bg-[var(--public-hover)] px-3 py-3 text-center text-xs text-[var(--public-muted)]">
                Applications open soon
              </p>
            )}
          </div>
        </aside>
      </div>
    </article>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-[var(--public-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--public-foreground)]">
        {value}
      </dd>
    </div>
  )
}
