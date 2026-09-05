import type { CSSProperties } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatJobLabel,
  formatRelativePostedAt,
} from "@/features/jobs/constants"
import { useJobsQuery } from "@/features/jobs/hooks/use-jobs-query"
import type { Job } from "@/features/jobs/types"
import type {
  BenefitsSection,
  CtaSection,
  PageConfig,
  PageSection,
} from "@/features/pages/types"

type LivePreviewProps = {
  draft: PageConfig
  companyId: string
}

export function LivePreview({ draft, companyId }: LivePreviewProps) {
  const { theme, sections } = draft
  const jobsQuery = useJobsQuery(companyId, { is_active: true })
  const activeJobs = jobsQuery.data?.items ?? []
  const hasOpenRolesSection = sections.some(
    (section) => section.type === "open_roles",
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Live preview</CardTitle>
        <CardDescription>
          Renders the current draft and active jobs in real time.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="min-h-[28rem] overflow-hidden border-t border-border"
          style={
            {
              "--preview-primary": theme.primaryColor,
              "--preview-secondary": theme.secondaryColor,
              backgroundColor: theme.secondaryColor,
              color: theme.primaryColor,
            } as CSSProperties
          }
        >
          {sections.length === 0 && activeJobs.length === 0 ? (
            <div className="flex min-h-[28rem] items-center justify-center px-6 text-center text-sm opacity-70">
              Add sections or active jobs to preview your careers page.
            </div>
          ) : (
            <>
              {sections.map((section) => (
                <PreviewSection
                  key={section.id}
                  section={section}
                  jobs={activeJobs}
                />
              ))}
              {!hasOpenRolesSection ? (
                <JobsPreviewSection
                  jobs={activeJobs}
                  title="Open roles"
                  subtitle={undefined}
                />
              ) : null}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PreviewSection({
  section,
  jobs,
}: {
  section: PageSection
  jobs: Job[]
}) {
  if (section.type === "hero") {
    return (
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
            Careers
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {section.title || "Untitled hero"}
          </h2>
          <p className="max-w-2xl text-base opacity-80 md:text-lg">
            {section.subtitle || "Add a subtitle for candidates."}
          </p>
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: "var(--preview-primary)",
              color: "var(--preview-secondary)",
            }}
          >
            {section.ctaLabel || "Learn more"}
          </button>
        </div>
      </section>
    )
  }

  if (section.type === "about") {
    return (
      <section className="border-t border-black/10 px-6 py-12 md:px-10">
        <div className="mx-auto max-w-3xl space-y-3">
          <h3 className="text-2xl font-semibold tracking-tight">
            {section.title || "About"}
          </h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed opacity-80 md:text-base">
            {section.body || "Add your company story."}
          </p>
        </div>
      </section>
    )
  }

  if (section.type === "benefits") {
    return <BenefitsPreviewSection section={section} />
  }

  if (section.type === "open_roles") {
    return (
      <JobsPreviewSection
        jobs={jobs}
        title={section.title}
        subtitle={section.subtitle}
      />
    )
  }

  return <CtaPreviewSection section={section} />
}

function BenefitsPreviewSection({ section }: { section: BenefitsSection }) {
  return (
    <section className="border-t border-black/10 px-6 py-12 md:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h3 className="text-2xl font-semibold tracking-tight">
          {section.title || "Benefits"}
        </h3>
        <ul className="grid gap-4 sm:grid-cols-2">
          {section.items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-black/10 px-4 py-3"
            >
              <p className="font-medium">{item.title || "Benefit"}</p>
              <p className="mt-1 text-sm opacity-75">
                {item.description || "Add a short description."}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CtaPreviewSection({ section }: { section: CtaSection }) {
  return (
    <section className="border-t border-black/10 px-6 py-14 md:px-10">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {section.title || "Ready to join us?"}
        </h3>
        <p className="mx-auto max-w-xl text-sm opacity-80 md:text-base">
          {section.subtitle || "Browse open roles or check back soon."}
        </p>
        <button
          type="button"
          className="rounded-md px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--preview-primary)",
            color: "var(--preview-secondary)",
          }}
        >
          {section.buttonLabel || "See open roles"}
        </button>
      </div>
    </section>
  )
}

function JobsPreviewSection({
  jobs,
  title,
  subtitle,
}: {
  jobs: Job[]
  title: string
  subtitle: string | undefined
}) {
  return (
    <section className="border-t border-black/10 px-6 py-12 md:px-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">
            {title || "Open roles"}
          </h3>
          {subtitle ? <p className="text-sm opacity-75">{subtitle}</p> : null}
        </div>
        {jobs.length === 0 ? (
          <p className="rounded-md border border-dashed border-black/15 px-4 py-8 text-center text-sm opacity-70">
            No active roles yet. Publish a job to show it here.
          </p>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="rounded-lg border border-black/10 px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-xs opacity-60">
                    {formatRelativePostedAt(job.posted_at)}
                  </p>
                </div>
                <p className="text-sm opacity-75">
                  {job.department} · {job.location} ·{" "}
                  {formatJobLabel(job.work_policy)}
                </p>
                <p className="text-sm opacity-70">
                  {formatJobLabel(job.experience_level)} ·{" "}
                  {formatJobLabel(job.job_type)}
                  {job.salary_range ? ` · ${job.salary_range}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
