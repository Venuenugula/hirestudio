import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import {
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  ExternalLink,
  FilePenLine,
  Globe,
  Pencil,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { PageContainer } from "@/components/shared/page-container"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCompanyQuery } from "@/features/company/hooks/use-company-query"
import { useJobsQuery } from "@/features/jobs/hooks/use-jobs-query"
import { formatJobLabel, formatRelativePostedAt } from "@/features/jobs/constants"
import { useCareersPageQuery } from "@/features/pages/hooks/use-careers-page-query"
import { formatRelativeTime } from "@/lib/relative-time"
import { getErrorMessage } from "@/lib/toast"
import { useAuth } from "@/providers/auth-provider"
import { useWorkspace } from "@/providers/workspace-provider"
import { routes } from "@/routes/paths"
import { cn } from "@/lib/utils"

export function DashboardPage() {
  const { company: authCompany } = useAuth()
  const { companyId, hasCompany } = useWorkspace()
  const companyQuery = useCompanyQuery(companyId)
  const pageQuery = useCareersPageQuery(companyId)
  const jobsQuery = useJobsQuery(companyId, { is_active: true })
  const allJobsQuery = useJobsQuery(companyId, {})

  if (!hasCompany || !companyId) {
    return (
      <PageContainer>
        <EmptyState
          icon={Building2}
          title="Set up your company"
          description="Create a company profile to unlock the dashboard, jobs, and careers page."
          action={
            <Button asChild>
              <Link to={routes.company}>Go to Company</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  const isLoading =
    companyQuery.isLoading || pageQuery.isLoading || jobsQuery.isLoading

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner label="Loading dashboard" />
        </div>
      </PageContainer>
    )
  }

  if (companyQuery.isError || pageQuery.isError || jobsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          title="Couldn't load dashboard"
          message={getErrorMessage(
            companyQuery.error ?? pageQuery.error ?? jobsQuery.error,
          )}
          onRetry={() => {
            void companyQuery.refetch()
            void pageQuery.refetch()
            void jobsQuery.refetch()
          }}
        />
      </PageContainer>
    )
  }

  const company = companyQuery.data ?? authCompany
  const page = pageQuery.data
  const activeJobs = jobsQuery.data?.items ?? []
  const allJobs = allJobsQuery.data?.items ?? activeJobs
  const isPublished = Boolean(page?.published_at)
  const lastUpdated = formatRelativeTime(
    page?.updated_at ?? company?.updated_at ?? null,
  )
  const recentJobs = [...allJobs]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 5)

  const activity = buildActivity({
    publishedAt: page?.published_at ?? null,
    companyUpdatedAt: company?.updated_at ?? null,
    recentJobs,
  })

  return (
    <PageContainer className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill published={isPublished} />
          {lastUpdated ? (
            <span className="text-xs text-muted-foreground">
              Last updated {lastUpdated}
            </span>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Welcome back
            {company?.name ? (
              <>
                ,{" "}
                <span className="text-primary">{company.name}</span>
              </>
            ) : null}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Manage your careers site, jobs, and company branding all in one
            place.
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Company"
          value={company?.name ?? "—"}
          hint={company?.slug ? `/${company.slug}` : undefined}
          icon={Building2}
          to={routes.company}
          iconClassName="bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
        />
        <StatCard
          label="Jobs"
          value={String(activeJobs.length)}
          hint={`${activeJobs.length} active`}
          icon={Briefcase}
          to={routes.jobs}
          iconClassName="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
        />
        <StatCard
          label="Page status"
          value={isPublished ? "Published" : "Draft"}
          hint={
            page?.published_at
              ? `Published ${formatRelativeTime(page.published_at)}`
              : "Publish from the builder"
          }
          icon={Globe}
          to={routes.careersPage}
          iconClassName="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          valueAddon={
            isPublished ? (
              <span className="mt-0.5 inline-block size-2 rounded-full bg-emerald-500" />
            ) : null
          }
        />
        <StatCard
          label="Visitors"
          value="—"
          hint="Coming soon"
          icon={Sparkles}
          muted
          badge="Phase 2"
          iconClassName="bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Quick actions
          </h2>
          <p className="text-sm text-muted-foreground">
            Jump into the most common workspace tasks.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to={routes.jobs}>
              <Plus className="size-4" />
              Create Job
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={routes.careersPage}>
              <FilePenLine className="size-4" />
              Edit Careers Page
            </Link>
          </Button>
          {company?.slug ? (
            <Button asChild variant="outline">
              <Link to={routes.publicCareers(company.slug)} target="_blank">
                <ExternalLink className="size-4" />
                Open Public Site
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link to={routes.company}>
              <Settings2 className="size-4" />
              Edit Company
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="gap-4 py-5 shadow-sm lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between px-5 pb-0">
            <CardTitle className="text-base">Recent jobs</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to={routes.jobs}>View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-5">
            {recentJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No jobs yet. Create your first role to populate this list.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentJobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex flex-wrap items-center gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary"
                      aria-hidden
                    >
                      {job.title.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="truncate font-medium">{job.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {job.department} · {job.location} ·{" "}
                        {formatJobLabel(job.work_policy)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-medium",
                          job.is_active
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {job.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-muted-foreground">
                        {formatRelativePostedAt(job.posted_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="gap-4 py-5 shadow-sm lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between px-5 pb-0">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <span className="text-xs text-muted-foreground">View all</span>
          </CardHeader>
          <CardContent className="px-5">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Activity will appear as you publish and update content.
              </p>
            ) : (
              <ul className="relative space-y-0">
                {activity.map((item, index) => (
                  <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
                    {index < activity.length - 1 ? (
                      <span
                        aria-hidden
                        className="absolute top-8 bottom-0 left-[15px] w-px bg-border"
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card",
                        item.tone,
                      )}
                    >
                      <item.icon className="size-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0 space-y-0.5 pt-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.when}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  )
}

function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        published
          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          published ? "bg-emerald-500" : "bg-amber-500",
        )}
      />
      {published ? "Published" : "Draft"}
    </span>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  muted,
  badge,
  to,
  iconClassName,
  valueAddon,
}: {
  label: string
  value: string
  hint?: string
  icon: typeof Building2
  muted?: boolean
  badge?: string
  to?: string
  iconClassName?: string
  valueAddon?: ReactNode
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            iconClassName ?? "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        {to ? (
          <ChevronRight className="size-4 text-muted-foreground/70" aria-hidden />
        ) : badge ? (
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:bg-violet-950 dark:text-violet-300">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate text-xl font-semibold tracking-tight",
              muted && "text-muted-foreground",
            )}
          >
            {value}
          </p>
          {valueAddon}
        </div>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        className="flex flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-accent/30"
      >
        {body}
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      {body}
    </div>
  )
}

function buildActivity(options: {
  publishedAt: string | null
  companyUpdatedAt: string | null
  recentJobs: Array<{
    id: string
    title: string
    created_at: string
    updated_at: string
  }>
}) {
  const items: Array<{
    id: string
    label: string
    when: string
    at: number
    icon: typeof Check
    tone: string
  }> = []

  if (options.publishedAt) {
    items.push({
      id: "published",
      label: "Published careers page",
      when: formatRelativeTime(options.publishedAt) ?? "",
      at: new Date(options.publishedAt).getTime(),
      icon: Check,
      tone: "border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400",
    })
  }

  if (options.companyUpdatedAt) {
    items.push({
      id: "company",
      label: "Updated company branding",
      when: formatRelativeTime(options.companyUpdatedAt) ?? "",
      at: new Date(options.companyUpdatedAt).getTime(),
      icon: Pencil,
      tone: "border-sky-200 text-sky-600 dark:border-sky-800 dark:text-sky-400",
    })
  }

  for (const job of options.recentJobs.slice(0, 3)) {
    items.push({
      id: `job-${job.id}`,
      label: `Created job · ${job.title}`,
      when: formatRelativeTime(job.created_at) ?? "",
      at: new Date(job.created_at).getTime(),
      icon: Plus,
      tone: "border-teal-200 text-teal-600 dark:border-teal-800 dark:text-teal-400",
    })
  }

  return items
    .filter((item) => item.when)
    .sort((a, b) => b.at - a.at)
    .slice(0, 6)
}
