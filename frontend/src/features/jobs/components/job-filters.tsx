import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EMPLOYMENT_TYPES, type JobFilters } from "@/features/jobs/types"

type JobFiltersProps = {
  value: JobFilters
  onChange: (next: JobFilters) => void
}

export function JobFiltersBar({ value, onChange }: JobFiltersProps) {
  const update = (patch: Partial<JobFilters>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
        <Field label="Employment type">
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            value={value.employment_type ?? ""}
            onChange={(event) =>
              update({
                employment_type: event.target.value || undefined,
              })
            }
          >
            <option value="">All types</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatEmploymentType(type)}
              </option>
            ))}
          </select>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

export function formatEmploymentType(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
