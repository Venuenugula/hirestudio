export const WORK_POLICIES = ["remote", "hybrid", "on_site"] as const
export const EMPLOYMENT_TYPES = ["full_time", "part_time", "contract"] as const
export const JOB_TYPES = ["permanent", "temporary", "internship"] as const
export const EXPERIENCE_LEVELS = ["junior", "mid_level", "senior"] as const

export type WorkPolicy = (typeof WORK_POLICIES)[number]
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]
export type JobType = (typeof JOB_TYPES)[number]
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]

const LABELS: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  on_site: "On-site",
  full_time: "Full time",
  part_time: "Part time",
  contract: "Contract",
  permanent: "Permanent",
  temporary: "Temporary",
  internship: "Internship",
  junior: "Junior",
  mid_level: "Mid-level",
  senior: "Senior",
}

export function formatJobLabel(value: string): string {
  return LABELS[value] ?? value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** Relative posted time for candidates (e.g. "3 days ago"). */
export function formatRelativePostedAt(
  iso: string,
  now: Date = new Date(),
): string {
  const posted = new Date(iso)
  if (Number.isNaN(posted.getTime())) {
    return ""
  }

  const diffMs = now.getTime() - posted.getTime()
  const dayMs = 24 * 60 * 60 * 1000
  const days = Math.max(0, Math.floor(diffMs / dayMs))

  if (days === 0) {
    return "Posted today"
  }
  if (days === 1) {
    return "1 day ago"
  }
  return `${days} days ago`
}
