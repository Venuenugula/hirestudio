import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Briefcase, Clock3, MapPin } from "lucide-react"

import {
  formatJobLabel,
  formatRelativePostedAt,
} from "@/features/jobs/constants"
import type { Job } from "@/features/jobs/types"
import {
  excerptAroundMatch,
  renderHighlightSegments,
} from "@/features/public/lib/job-search"
import { jobCardThemeForId } from "@/features/public/lib/public-design"
import { cn } from "@/lib/utils"
import { routes } from "@/routes/paths"

type PublicJobCardProps = {
  job: Job
  slug: string
  companyName: string
  searchQuery?: string
  disableNavigation?: boolean
  layout?: "cards" | "list"
}

function HighlightedText({ text, query }: { text: string; query?: string }) {
  const segments = renderHighlightSegments(text, query ?? "")
  return (
    <>
      {segments.map((segment, index) =>
        segment.hit ? (
          <mark
            key={`${segment.text}-${index}`}
            className="rounded-sm bg-amber-200/80 px-0.5 text-inherit"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        ),
      )}
    </>
  )
}

export function PublicJobCard({
  job,
  slug,
  companyName,
  searchQuery = "",
  disableNavigation = false,
  layout = "cards",
}: PublicJobCardProps) {
  const theme = jobCardThemeForId(job.id)
  const brandAccent = "var(--public-primary)"
  const brandChip = "var(--public-hover)"
  const snippet =
    searchQuery.trim().length >= 2
      ? excerptAroundMatch(job.description, searchQuery)
      : ""
  const isList = layout === "list"

  const cardClassName = cn(
    "group block border transition-all duration-200",
    isList
      ? "rounded-[var(--public-radius)] px-4 py-4 hover:bg-[var(--public-hover)]"
      : "rounded-[var(--public-radius)] p-5 hover:-translate-y-0.5 hover:shadow-lg",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--public-accent)]",
  )
  const cardStyle = isList
    ? {
        backgroundColor: "var(--public-surface)",
        borderColor: "var(--public-border)",
      }
    : {
        backgroundColor: theme.background,
        borderColor: theme.border,
      }

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p
            className="text-xs font-medium tracking-wide uppercase"
            style={{ color: brandAccent }}
          >
            {companyName}
          </p>
          <h3
            className={cn(
              "font-semibold tracking-tight text-slate-900",
              isList ? "text-base md:text-lg" : "text-xl md:text-2xl",
            )}
          >
            <HighlightedText text={job.title} query={searchQuery} />
          </h3>
        </div>
        <p className="shrink-0 text-xs text-slate-500">
          {formatRelativePostedAt(job.posted_at)}
        </p>
      </div>

      {!isList ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <MetaChip
            icon={<MapPin className="size-3.5" />}
            label={job.location}
            chipColor={brandChip}
            accent={brandAccent}
          />
          <MetaChip
            icon={<Clock3 className="size-3.5" />}
            label={formatJobLabel(job.employment_type)}
            chipColor={brandChip}
            accent={brandAccent}
          />
          <MetaChip
            icon={<Briefcase className="size-3.5" />}
            label={formatJobLabel(job.experience_level)}
            chipColor={brandChip}
            accent={brandAccent}
          />
          <MetaChip
            label={formatJobLabel(job.work_policy)}
            chipColor={brandChip}
            accent={brandAccent}
          />
        </div>
      ) : (
        <p className="mt-1 text-sm text-slate-600">
          {job.location} · {formatJobLabel(job.work_policy)} ·{" "}
          {formatJobLabel(job.employment_type)}
        </p>
      )}

      {!isList && job.salary_range ? (
        <p
          className="mt-4 text-lg font-semibold tracking-tight"
          style={{ color: brandAccent }}
        >
          {job.salary_range}
        </p>
      ) : null}

      {!isList ? (
        <p className="mt-2 text-sm text-slate-600">
          {job.department}
          <span className="mx-1.5 text-slate-300">·</span>
          {formatJobLabel(job.job_type)}
        </p>
      ) : null}

      {!isList && snippet ? (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
          <HighlightedText text={snippet} query={searchQuery} />
        </p>
      ) : null}

      <div className={cn("flex", isList ? "mt-3 justify-between" : "mt-5 justify-end")}>
        {isList && job.salary_range ? (
          <p className="text-sm font-semibold" style={{ color: brandAccent }}>
            {job.salary_range}
          </p>
        ) : (
          <span />
        )}
        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5"
          style={{
            backgroundColor: brandAccent,
            borderRadius: "var(--public-radius)",
          }}
        >
          View Job
          <ArrowRight className="size-4" />
        </span>
      </div>
    </>
  )

  return (
    <li>
      {disableNavigation ? (
        <div className={cardClassName} style={cardStyle}>
          {content}
        </div>
      ) : (
        <Link
          to={routes.publicJob(slug, job.id)}
          className={cardClassName}
          style={cardStyle}
        >
          {content}
        </Link>
      )}
    </li>
  )
}

function MetaChip({
  icon,
  label,
  chipColor,
  accent,
}: {
  icon?: ReactNode
  label: string
  chipColor: string
  accent: string
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: chipColor, color: accent }}
    >
      {icon}
      {label}
    </span>
  )
}
