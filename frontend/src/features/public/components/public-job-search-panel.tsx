import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import type { Job } from "@/features/jobs/types"
import {
  EMPTY_PUBLIC_JOB_FILTERS,
  POPULAR_SEARCHES,
  SORT_OPTIONS,
  collectFilterOptions,
  getActiveFilterChips,
  searchPublicJobs,
  suggestJobTitles,
  type PublicJobFilters,
} from "@/features/public/lib/job-search"
import { cn } from "@/lib/utils"

const SEARCH_DEBOUNCE_MS = 300

type PublicJobSearchPanelProps = {
  jobs: Job[]
  filters: PublicJobFilters
  onChange: Dispatch<SetStateAction<PublicJobFilters>>
  resultCount: number
}

export function PublicJobSearchPanel({
  jobs,
  filters,
  onChange,
  resultCount,
}: PublicJobSearchPanelProps) {
  const [draftQuery, setDraftQuery] = useState(filters.query)
  const deferredQuery = useDeferredValue(draftQuery)
  const options = useMemo(() => collectFilterOptions(jobs), [jobs])
  const chips = getActiveFilterChips(filters)
  const suggestions = useMemo(
    () => suggestJobTitles(jobs, draftQuery),
    [jobs, draftQuery],
  )

  useEffect(() => {
    setDraftQuery(filters.query)
  }, [filters.query])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onChange((prev) =>
        prev.query === deferredQuery ? prev : { ...prev, query: deferredQuery },
      )
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [deferredQuery, onChange])

  const patch = (partial: Partial<PublicJobFilters>) => {
    onChange((prev) => ({ ...prev, ...partial }))
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--public-border)] bg-[var(--public-surface)] p-4 shadow-sm md:p-5">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[var(--public-foreground)]">
          Search Jobs
        </h3>
        <p className="text-xs text-[var(--public-muted)]">
          Try natural language like “remote python in Hyderabad” or “AI intern”.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--public-muted)]" />
        <Input
          value={draftQuery}
          onChange={(event) => setDraftQuery(event.target.value)}
          placeholder="Search by title, skill, department, location…"
          className="h-11 rounded-xl border-[var(--public-border)] bg-white pr-10 pl-10"
          aria-label="Search jobs"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
        />
        {draftQuery ? (
          <button
            type="button"
            className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--public-muted)] hover:bg-slate-100"
            aria-label="Clear search"
            onClick={() => {
              setDraftQuery("")
              patch({ query: "" })
            }}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {suggestions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-[var(--public-muted)] uppercase">
            Suggestions
          </p>
          <ul className="overflow-hidden rounded-xl border border-[var(--public-border)] bg-white">
            {suggestions.map((title) => (
              <li key={title}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--public-foreground)] transition-colors hover:bg-[var(--public-hover)]"
                  onClick={() => {
                    setDraftQuery(title)
                    patch({ query: title })
                  }}
                >
                  <Search className="size-3.5 shrink-0 text-[var(--public-muted)]" />
                  <span className="truncate">{title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!draftQuery ? (
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-[var(--public-muted)] uppercase">
            Popular searches
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                className="rounded-full border border-[var(--public-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--public-foreground)] transition-colors hover:border-[var(--public-accent)] hover:bg-[var(--public-hover)]"
                onClick={() => {
                  setDraftQuery(term)
                  patch({ query: term })
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FilterSelect
          label="Location"
          value={filters.location ?? ""}
          onChange={(value) => patch({ location: value || null })}
          options={options.locations.map((value) => ({ value, label: value }))}
        />
        <FilterSelect
          label="Experience"
          value={filters.experience_level ?? ""}
          onChange={(value) => patch({ experience_level: value || null })}
          options={options.experienceLevels}
        />
        <FilterSelect
          label="Employment"
          value={filters.employment_type ?? ""}
          onChange={(value) => patch({ employment_type: value || null })}
          options={options.employmentTypes}
        />
        <FilterSelect
          label="Work policy"
          value={filters.work_policy ?? ""}
          onChange={(value) => patch({ work_policy: value || null })}
          options={options.workPolicies}
        />
        <FilterSelect
          label="Department"
          value={filters.department ?? ""}
          onChange={(value) => patch({ department: value || null })}
          options={options.departments.map((value) => ({
            value,
            label: value,
          }))}
        />
        <FilterSelect
          label="Sort"
          value={filters.sort}
          onChange={(value) =>
            patch({ sort: (value as PublicJobFilters["sort"]) || "latest" })
          }
          options={SORT_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          allowEmpty={false}
        />
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-[var(--public-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--public-primary)]"
              onClick={() =>
                onChange((prev) => ({ ...prev, [chip.key]: null }))
              }
            >
              {chip.label}
              <X className="size-3" />
            </button>
          ))}
          <button
            type="button"
            className="text-xs font-medium text-[var(--public-muted)] underline-offset-2 hover:underline"
            onClick={() =>
              onChange((prev) => ({
                ...EMPTY_PUBLIC_JOB_FILTERS,
                sort: prev.sort,
              }))
            }
          >
            Clear filters
          </button>
        </div>
      ) : null}

      <p className="text-sm font-medium text-[var(--public-foreground)]">
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </p>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allowEmpty = true,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  allowEmpty?: boolean
}) {
  return (
    <label className="space-y-1.5 text-xs font-medium text-[var(--public-muted)]">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[var(--public-border)] bg-white px-3 text-sm text-[var(--public-foreground)] outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--public-accent)]/40",
        )}
      >
        {allowEmpty ? <option value="">All</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function useFilteredPublicJobs(
  jobs: Job[],
  filters: PublicJobFilters,
): Job[] {
  return useMemo(() => searchPublicJobs(jobs, filters), [jobs, filters])
}
