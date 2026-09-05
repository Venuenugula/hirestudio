import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, type ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  companyFormDefaults,
  companyFormSchema,
  type CompanyFormParsed,
  type CompanyFormValues,
} from "@/features/company/schemas/company-schema"
import type { Company } from "@/features/company/types"
import { cn } from "@/lib/utils"

type CompanyFormProps = {
  mode: "create" | "edit"
  company?: Company
  isSubmitting?: boolean
  onSubmit: (values: CompanyFormParsed) => Promise<void> | void
}

function toFormValues(company?: Company): CompanyFormValues {
  if (!company) {
    return companyFormDefaults
  }

  return {
    name: company.name,
    slug: company.slug,
    logo_url: company.logo_url ?? "",
    banner_url: company.banner_url ?? "",
    primary_color: company.primary_color,
    secondary_color: company.secondary_color,
    is_active: company.is_active,
  }
}

export function CompanyForm({
  mode,
  company,
  isSubmitting = false,
  onSubmit,
}: CompanyFormProps) {
  const form = useForm<CompanyFormValues, unknown, CompanyFormParsed>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: toFormValues(company),
    mode: "onBlur",
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting: formSubmitting },
  } = form

  useEffect(() => {
    reset(toFormValues(company))
  }, [company, reset])

  const saving = isSubmitting || formSubmitting
  const submitDisabled = saving || (mode === "edit" && !isDirty)
  const primaryColor = watch("primary_color")
  const secondaryColor = watch("secondary_color")

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create company" : "Edit company"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Set up your first tenant. The active company id is stored locally until auth lands."
            : "Update branding and status. Save is enabled only when the form is dirty."}
        </CardDescription>
      </CardHeader>

      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values)
        })}
        noValidate
      >
        <CardContent className="space-y-4">
          <Field id="name" label="Company name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="Acme Corp"
              aria-invalid={Boolean(errors.name)}
              disabled={saving}
              {...register("name")}
            />
          </Field>

          <Field id="slug" label="Slug" error={errors.slug?.message}>
            <Input
              id="slug"
              placeholder="acme-corp"
              aria-invalid={Boolean(errors.slug)}
              disabled={saving}
              {...register("slug")}
            />
          </Field>

          <Field id="logo_url" label="Logo URL" error={errors.logo_url?.message}>
            <Input
              id="logo_url"
              placeholder="https://cdn.example.com/logo.png"
              aria-invalid={Boolean(errors.logo_url)}
              disabled={saving}
              {...register("logo_url")}
            />
          </Field>

          <Field
            id="banner_url"
            label="Banner URL"
            error={errors.banner_url?.message}
          >
            <Input
              id="banner_url"
              placeholder="https://cdn.example.com/banner.jpg"
              aria-invalid={Boolean(errors.banner_url)}
              disabled={saving}
              {...register("banner_url")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="primary_color"
              label="Primary color"
              error={errors.primary_color?.message}
            >
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  className="h-9 w-14 cursor-pointer p-1"
                  disabled={saving}
                  value={/^#[0-9A-Fa-f]{6}$/.test(primaryColor) ? primaryColor : "#111111"}
                  onChange={(event) =>
                    setValue("primary_color", event.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <Input
                  id="primary_color"
                  aria-invalid={Boolean(errors.primary_color)}
                  disabled={saving}
                  {...register("primary_color")}
                />
              </div>
            </Field>

            <Field
              id="secondary_color"
              label="Secondary color"
              error={errors.secondary_color?.message}
            >
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  className="h-9 w-14 cursor-pointer p-1"
                  disabled={saving}
                  value={
                    /^#[0-9A-Fa-f]{6}$/.test(secondaryColor)
                      ? secondaryColor
                      : "#FFFFFF"
                  }
                  onChange={(event) =>
                    setValue("secondary_color", event.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <Input
                  id="secondary_color"
                  aria-invalid={Boolean(errors.secondary_color)}
                  disabled={saving}
                  {...register("secondary_color")}
                />
              </div>
            </Field>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active status</Label>
              <p className="text-xs text-muted-foreground">
                Inactive companies can be hidden from public surfaces later.
              </p>
            </div>
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Switch
                  id="is_active"
                  checked={field.value}
                  disabled={saving}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-xs text-muted-foreground",
              mode === "edit" && isDirty && "text-foreground",
            )}
          >
            {mode === "edit"
              ? isDirty
                ? "Unsaved changes"
                : "No changes to save"
              : "Creates a new company tenant"}
          </p>
          <Button type="submit" disabled={submitDisabled}>
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create company"
                : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

type FieldProps = {
  id: string
  label: string
  error?: string
  children: ReactNode
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
