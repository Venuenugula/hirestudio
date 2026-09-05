import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORK_POLICIES,
  formatJobLabel,
} from "@/features/jobs/constants"
import type { JobFilters } from "@/features/jobs/types"

type JobFiltersProps = {
  value: JobFilters
  onChange: (next: JobFilters) => void
}

export function JobFiltersBar({ value, onChange }: JobFiltersProps) {
  const update = (patch: Partial<JobFilters>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Search title">
          <Input
            placeholder="Search jobs"
            value={value.title ?? ""}
            onChange={(event) => update({ title: event.target.value })}
          />
        </Field>
        <Field label="Department">
          <Input
            placeholder="Engineering"
            value={value.department ?? ""}
            onChange={(event) => update({ department: event.target.value })}
          />
        </Field>
        <Field label="Location">
          <Input
            placeholder="Remote"
            value={value.location ?? ""}
            onChange={(event) => update({ location: event.target.value })}
          />
        </Field>
        <Field label="Status">
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            value={
              value.is_active === true
                ? "active"
                : value.is_active === false
                  ? "inactive"
                  : "all"
            }
            onChange={(event) => {
              const next = event.target.value
              update({
                is_active:
                  next === "active" ? true : next === "inactive" ? false : null,
              })
            }}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
        <Field label="Employment type">
          <SelectFilter
            value={value.employment_type ?? ""}
            onChange={(employment_type) => update({ employment_type })}
            options={EMPLOYMENT_TYPES}
            allLabel="All employment types"
          />
        </Field>
        <Field label="Work policy">
          <SelectFilter
            value={value.work_policy ?? ""}
            onChange={(work_policy) => update({ work_policy })}
            options={WORK_POLICIES}
            allLabel="All work policies"
          />
        </Field>
        <Field label="Experience">
          <SelectFilter
            value={value.experience_level ?? ""}
            onChange={(experience_level) => update({ experience_level })}
            options={EXPERIENCE_LEVELS}
            allLabel="All levels"
          />
        </Field>
        <Field label="Job type">
          <SelectFilter
            value={value.job_type ?? ""}
            onChange={(job_type) => update({ job_type })}
            options={JOB_TYPES}
            allLabel="All job types"
          />
        </Field>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({
              title: "",
              department: "",
              location: "",
              employment_type: undefined,
              work_policy: undefined,
              experience_level: undefined,
              job_type: undefined,
              is_active: null,
            })
          }
        >
          Reset filters
        </Button>
      </div>
    </div>
  )
}

function SelectFilter({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: string
  onChange: (value: string | undefined) => void
  options: readonly string[]
  allLabel: string
}) {
  return (
    <select
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      value={value}
      onChange={(event) => onChange(event.target.value || undefined)}
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {formatJobLabel(option)}
        </option>
      ))}
    </select>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

/** @deprecated Prefer formatJobLabel from constants.ts */
export function formatEmploymentType(value: string) {
  return formatJobLabel(value)
}
