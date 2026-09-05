import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { formatEmploymentType } from "@/features/jobs/components/job-filters"
import {
  jobFormDefaults,
  jobFormSchema,
  type JobFormParsed,
  type JobFormValues,
} from "@/features/jobs/schemas/job-schema"
import { EMPLOYMENT_TYPES, type Job } from "@/features/jobs/types"

type JobFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  job?: Job | null
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: JobFormParsed) => Promise<void> | void
}

function toValues(job?: Job | null): JobFormValues {
  if (!job) {
    return jobFormDefaults
  }
  return {
    title: job.title,
    department: job.department,
    location: job.location,
    employment_type: (EMPLOYMENT_TYPES as readonly string[]).includes(
      job.employment_type,
    )
      ? (job.employment_type as JobFormValues["employment_type"])
      : "full_time",
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
      description="Open roles appear in the careers page preview when active."
      className="sm:max-w-xl"
    >
      <form
        className="space-y-4"
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
        <Field label="Employment type" error={errors.employment_type?.message}>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            disabled={saving}
            {...register("employment_type")}
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatEmploymentType(type)}
              </option>
            ))}
          </select>
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
              Inactive jobs are hidden from the public preview.
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
