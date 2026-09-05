import type { ComponentProps, ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORK_POLICIES,
  formatJobLabel,
} from "@/features/jobs/constants"
import {
  jobFormDefaults,
  jobFormSchema,
  type JobFormParsed,
  type JobFormValues,
} from "@/features/jobs/schemas/job-schema"
import type { Job } from "@/features/jobs/types"

type JobFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  job?: Job | null
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: JobFormParsed) => Promise<void> | void
}

function pickEnum<T extends string>(
  value: string,
  allowed: readonly T[],
  fallback: T,
): T {
  return (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

function toValues(job?: Job | null): JobFormValues {
  if (!job) {
    return jobFormDefaults
  }
  return {
    title: job.title,
    department: job.department,
    location: job.location,
    employment_type: pickEnum(job.employment_type, EMPLOYMENT_TYPES, "full_time"),
    work_policy: pickEnum(job.work_policy, WORK_POLICIES, "remote"),
    experience_level: pickEnum(
      job.experience_level,
      EXPERIENCE_LEVELS,
      "mid_level",
    ),
    job_type: pickEnum(job.job_type, JOB_TYPES, "permanent"),
    salary_range: job.salary_range ?? "",
    description: job.description,
    is_active: job.is_active,
    application_url: job.application_url ?? "",
  }
}

export function JobFormDialog({
  open,
  mode,
  job,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: JobFormDialogProps) {
  const form = useForm<JobFormValues, unknown, JobFormParsed>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: toValues(job),
    mode: "onBlur",
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: formSubmitting },
  } = form

  useEffect(() => {
    if (open) {
      reset(toValues(job))
    }
  }, [open, job, reset])

  const saving = isSubmitting || formSubmitting

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Create job" : "Edit job"}
      description="Open roles appear on the public careers site when active."
      className="sm:max-w-xl"
    >
      <form
        className="max-h-[70vh] space-y-4 overflow-y-auto pr-1"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values)
          onOpenChange(false)
        })}
        noValidate
      >
        <Field label="Title" error={errors.title?.message}>
          <Input disabled={saving} {...register("title")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Department" error={errors.department?.message}>
            <Input disabled={saving} {...register("department")} />
          </Field>
          <Field label="Location" error={errors.location?.message}>
            <Input disabled={saving} {...register("location")} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Employment type" error={errors.employment_type?.message}>
            <SelectField
              disabled={saving}
              options={EMPLOYMENT_TYPES}
              {...register("employment_type")}
            />
          </Field>
          <Field label="Work policy" error={errors.work_policy?.message}>
            <SelectField
              disabled={saving}
              options={WORK_POLICIES}
              {...register("work_policy")}
            />
          </Field>
          <Field label="Experience" error={errors.experience_level?.message}>
            <SelectField
              disabled={saving}
              options={EXPERIENCE_LEVELS}
              {...register("experience_level")}
            />
          </Field>
          <Field label="Job type" error={errors.job_type?.message}>
            <SelectField
              disabled={saving}
              options={JOB_TYPES}
              {...register("job_type")}
            />
          </Field>
        </div>
        <Field label="Salary range" error={errors.salary_range?.message}>
          <Input
            placeholder="USD 80K–120K / year"
            disabled={saving}
            {...register("salary_range")}
          />
        </Field>
        <Field label="Description" error={errors.description?.message}>
          <Textarea disabled={saving} {...register("description")} />
        </Field>
        <Field label="Application URL" error={errors.application_url?.message}>
          <Input
            placeholder="https://..."
            disabled={saving}
            {...register("application_url")}
          />
        </Field>
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <div>
            <Label htmlFor="job-active">Active</Label>
            <p className="text-xs text-muted-foreground">
              Inactive jobs are hidden from the public careers site.
            </p>
          </div>
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <Switch
                id="job-active"
                checked={field.value}
                disabled={saving}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create job"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

function SelectField({
  options,
  disabled,
  ...props
}: {
  options: readonly string[]
  disabled?: boolean
} & ComponentProps<"select">) {
  return (
    <select
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      disabled={disabled}
      {...props}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {formatJobLabel(option)}
        </option>
      ))}
    </select>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
