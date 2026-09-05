import Fuse from "fuse.js"

import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORK_POLICIES,
  formatJobLabel,
} from "@/features/jobs/constants"
import type { Job } from "@/features/jobs/types"

export type JobSortOption = "latest" | "oldest" | "salary_desc" | "title_asc"

export type PublicJobFilters = {
  query: string
  location: string | null
  experience_level: string | null
  employment_type: string | null
  work_policy: string | null
  department: string | null
  job_type: string | null
  sort: JobSortOption
}

export const EMPTY_PUBLIC_JOB_FILTERS: PublicJobFilters = {
  query: "",
  location: null,
  experience_level: null,
  employment_type: null,
  work_policy: null,
  department: null,
  job_type: null,
  sort: "latest",
}

export const POPULAR_SEARCHES = [
  "Python",
  "AI",
  "Frontend",
  "Remote",
  "Internship",
  "Data Engineer",
] as const

export const SORT_OPTIONS: { value: JobSortOption; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "salary_desc", label: "Highest Salary" },
  { value: "oldest", label: "Oldest" },
  { value: "title_asc", label: "A–Z" },
]

type ParsedQuery = {
  remainingQuery: string
  location?: string
  experience_level?: string
  employment_type?: string
  work_policy?: string
  job_type?: string
  minSalaryLpa?: number
}

const EXPERIENCE_ALIASES: Record<string, string> = {
  junior: "junior",
  entry: "junior",
  fresher: "junior",
  mid: "mid_level",
  "mid-level": "mid_level",
  intermediate: "mid_level",
  senior: "senior",
  sr: "senior",
  lead: "senior",
}

const WORK_ALIASES: Record<string, string> = {
  remote: "remote",
  wfh: "remote",
  hybrid: "hybrid",
  onsite: "on_site",
  "on-site": "on_site",
  office: "on_site",
}

const EMPLOYMENT_ALIASES: Record<string, string> = {
  "full time": "full_time",
  fulltime: "full_time",
  "full-time": "full_time",
  "part time": "part_time",
  parttime: "part_time",
  contract: "contract",
}

const JOB_TYPE_ALIASES: Record<string, string> = {
  intern: "internship",
  internship: "internship",
  internships: "internship",
  permanent: "permanent",
  temporary: "temporary",
  contract: "temporary",
}

/** Lightweight natural-language → structured filters (rule-based MVP). */
export function parseNaturalLanguageQuery(
  raw: string,
  knownLocations: string[] = [],
): ParsedQuery {
  let text = raw.trim().toLowerCase()
  if (!text) {
    return { remainingQuery: "" }
  }

  const result: ParsedQuery = { remainingQuery: text }

  const salaryMatch = text.match(
    /(?:above|over|paying\s+above|>\s*)\s*(\d+)\s*(?:lpa|lakh|lakhs)?/i,
  )
  if (salaryMatch) {
    result.minSalaryLpa = Number(salaryMatch[1])
    text = text.replace(salaryMatch[0], " ")
  }

  for (const [alias, value] of Object.entries(WORK_ALIASES)) {
    const pattern = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i")
    if (pattern.test(text)) {
      result.work_policy = value
      text = text.replace(pattern, " ")
    }
  }

  for (const [alias, value] of Object.entries(EXPERIENCE_ALIASES)) {
    const pattern = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i")
    if (pattern.test(text)) {
      result.experience_level = value
      text = text.replace(pattern, " ")
    }
  }

  for (const [alias, value] of Object.entries(EMPLOYMENT_ALIASES)) {
    const pattern = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i")
    if (pattern.test(text)) {
      result.employment_type = value
      text = text.replace(pattern, " ")
    }
  }

  for (const [alias, value] of Object.entries(JOB_TYPE_ALIASES)) {
    const pattern = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i")
    if (pattern.test(text)) {
      result.job_type = value
      text = text.replace(pattern, " ")
    }
  }

  // Strip filler words used in NL queries.
  text = text.replace(
    /\b(jobs?|roles?|positions?|openings?|for|with|in|the|a|an|looking|for)\b/gi,
    " ",
  )

  const sortedLocations = [...knownLocations].sort(
    (a, b) => b.length - a.length,
  )
  for (const location of sortedLocations) {
    const pattern = new RegExp(`\\b${escapeRegExp(location.toLowerCase())}\\b`, "i")
    if (pattern.test(text)) {
      result.location = location
      text = text.replace(pattern, " ")
      break
    }
  }

  result.remainingQuery = text.replace(/\s+/g, " ").trim()
  return result
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Extract a rough LPA number from free-text salary ranges for sorting/filtering. */
export function parseSalaryScore(salaryRange: string | null): number {
  if (!salaryRange) {
    return 0
  }
  const matches = salaryRange.match(/\d+(?:\.\d+)?/g)
  if (!matches || matches.length === 0) {
    return 0
  }
  const nums = matches.map(Number)
  return Math.max(...nums)
}

function applyStructuredFilters(
  jobs: Job[],
  filters: PublicJobFilters,
  parsed: ParsedQuery,
): Job[] {
  return jobs.filter((job) => {
    const location = filters.location ?? parsed.location
    if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
      return false
    }

    const experience = filters.experience_level ?? parsed.experience_level
    if (experience && job.experience_level !== experience) {
      return false
    }

    const employment = filters.employment_type ?? parsed.employment_type
    if (employment && job.employment_type !== employment) {
      return false
    }

    const work = filters.work_policy ?? parsed.work_policy
    if (work && job.work_policy !== work) {
      return false
    }

    const department = filters.department
    if (
      department &&
      !job.department.toLowerCase().includes(department.toLowerCase())
    ) {
      return false
    }

    const jobType = filters.job_type ?? parsed.job_type
    if (jobType && job.job_type !== jobType) {
      return false
    }

    if (parsed.minSalaryLpa) {
      const score = parseSalaryScore(job.salary_range)
      if (score < parsed.minSalaryLpa) {
        return false
      }
    }

    return true
  })
}

function sortJobs(jobs: Job[], sort: JobSortOption): Job[] {
  const next = [...jobs]
  switch (sort) {
    case "oldest":
      return next.sort(
        (a, b) =>
          new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime(),
      )
    case "salary_desc":
      return next.sort(
        (a, b) =>
          parseSalaryScore(b.salary_range) - parseSalaryScore(a.salary_range),
      )
    case "title_asc":
      return next.sort((a, b) => a.title.localeCompare(b.title))
    case "latest":
    default:
      return next.sort(
        (a, b) =>
          new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime(),
      )
  }
}

export function searchPublicJobs(
  jobs: Job[],
  filters: PublicJobFilters,
): Job[] {
  const locations = [...new Set(jobs.map((job) => job.location))]
  const parsed = parseNaturalLanguageQuery(filters.query, locations)
  const structured = applyStructuredFilters(jobs, filters, parsed)

  const query = parsed.remainingQuery
  if (!query) {
    return sortJobs(structured, filters.sort)
  }

  const fuse = new Fuse(structured, {
    includeScore: true,
    threshold: 0.38,
    ignoreLocation: true,
    keys: [
      { name: "title", weight: 0.35 },
      { name: "department", weight: 0.15 },
      { name: "location", weight: 0.12 },
      { name: "description", weight: 0.25 },
      { name: "salary_range", weight: 0.05 },
      { name: "work_policy", weight: 0.04 },
      { name: "experience_level", weight: 0.02 },
      { name: "employment_type", weight: 0.02 },
    ],
  })

  const matched = fuse.search(query).map((result) => result.item)
  return sortJobs(matched, filters.sort)
}

export function collectFilterOptions(jobs: Job[]) {
  const unique = (values: string[]) =>
    [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))

  return {
    locations: unique(jobs.map((job) => job.location)),
    departments: unique(jobs.map((job) => job.department)),
    experienceLevels: EXPERIENCE_LEVELS.map((value) => ({
      value,
      label: formatJobLabel(value),
    })),
    employmentTypes: EMPLOYMENT_TYPES.map((value) => ({
      value,
      label: formatJobLabel(value),
    })),
    workPolicies: WORK_POLICIES.map((value) => ({
      value,
      label: formatJobLabel(value),
    })),
    jobTypes: JOB_TYPES.map((value) => ({
      value,
      label: formatJobLabel(value),
    })),
  }
}

export type ActiveFilterChip = {
  key: keyof PublicJobFilters
  label: string
}

export function getActiveFilterChips(
  filters: PublicJobFilters,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []
  if (filters.location) {
    chips.push({ key: "location", label: filters.location })
  }
  if (filters.experience_level) {
    chips.push({
      key: "experience_level",
      label: formatJobLabel(filters.experience_level),
    })
  }
  if (filters.employment_type) {
    chips.push({
      key: "employment_type",
      label: formatJobLabel(filters.employment_type),
    })
  }
  if (filters.work_policy) {
    chips.push({
      key: "work_policy",
      label: formatJobLabel(filters.work_policy),
    })
  }
  if (filters.department) {
    chips.push({ key: "department", label: filters.department })
  }
  if (filters.job_type) {
    chips.push({ key: "job_type", label: formatJobLabel(filters.job_type) })
  }
  return chips
}

/** Highlight query terms in text for card snippets. */
export function renderHighlightSegments(
  text: string,
  query: string,
): Array<{ text: string; hit: boolean }> {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length >= 2)
  if (!text || terms.length === 0) {
    return [{ text, hit: false }]
  }

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi")
  const segments: Array<{ text: string; hit: boolean }> = []
  let lastIndex = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, index), hit: false })
    }
    segments.push({ text: match[0], hit: true })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), hit: false })
  }
  return segments.length > 0 ? segments : [{ text, hit: false }]
}

export function excerptAroundMatch(description: string, query: string): string {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length >= 2)
  if (!description) {
    return ""
  }
  if (terms.length === 0) {
    return description.slice(0, 140)
  }

  const lower = description.toLowerCase()
  let index = -1
  for (const term of terms) {
    index = lower.indexOf(term.toLowerCase())
    if (index >= 0) {
      break
    }
  }
  if (index < 0) {
    return description.slice(0, 140)
  }
  const start = Math.max(0, index - 40)
  const end = Math.min(description.length, index + 100)
  const prefix = start > 0 ? "…" : ""
  const suffix = end < description.length ? "…" : ""
  return `${prefix}${description.slice(start, end).trim()}${suffix}`
}

/** Title suggestions for typeahead while the user is typing. */
export function suggestJobTitles(
  jobs: Job[],
  query: string,
  limit = 5,
): string[] {
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    return []
  }

  const matches = searchPublicJobs(jobs, {
    ...EMPTY_PUBLIC_JOB_FILTERS,
    query: trimmed,
  })

  const titles: string[] = []
  const seen = new Set<string>()
  for (const job of matches) {
    const key = job.title.toLowerCase()
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    titles.push(job.title)
    if (titles.length >= limit) {
      break
    }
  }
  return titles
}
