import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, type ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

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
import { uploadCompanyMedia } from "@/features/company/api/company-api"
import { BrandPreview } from "@/features/company/components/brand-preview"
import { ImageDropzone } from "@/features/company/components/image-dropzone"
import {
  companyFormDefaults,
  companyFormSchema,
  type CompanyFormParsed,
  type CompanyFormValues,
} from "@/features/company/schemas/company-schema"
import {
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_SUGGESTIONS,
  type Company,
  type CompanyMediaKind,
} from "@/features/company/types"
import { getErrorMessage } from "@/lib/toast"
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
    website: company.website ?? "",
    industry: company.industry ?? "",
    company_size: company.company_size ?? "",
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
  const [uploadingKind, setUploadingKind] = useState<CompanyMediaKind | null>(
    null,
  )

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
  const values = watch()

  const handleUpload = async (kind: CompanyMediaKind, file: File) => {
    setUploadingKind(kind)
    try {
      const result = await uploadCompanyMedia(kind, file)
      setValue(kind === "logo" ? "logo_url" : "banner_url", result.url, {
        shouldDirty: true,
        shouldValidate: true,
      })
      toast.success(kind === "logo" ? "Logo uploaded" : "Banner uploaded")
    } catch (error) {
      toast.error(getErrorMessage(error, "Upload failed"))
    } finally {
      setUploadingKind(null)
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.9fr)]">
      <form
        className="space-y-6"
        onSubmit={handleSubmit(async (parsed) => {
          await onSubmit(parsed)
        })}
        noValidate
      >
        <Card className="gap-0 py-0">
          <CardHeader className="border-b border-border px-6 py-5">
            <CardTitle className="text-xl">Company branding</CardTitle>
            <CardDescription>
              Logo, identity, and theme colors for your public careers site.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-6 py-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <ImageDropzone
                label="Logo"
                value={values.logo_url || null}
                disabled={saving}
                uploading={uploadingKind === "logo"}
                aspectClassName="aspect-square max-h-56"
                onUpload={(file) => handleUpload("logo", file)}
                onRemove={() =>
                  setValue("logo_url", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              <ImageDropzone
                label="Banner"
                value={values.banner_url || null}
                disabled={saving}
                uploading={uploadingKind === "banner"}
                aspectClassName="aspect-[16/9]"
                onUpload={(file) => handleUpload("banner", file)}
                onRemove={() =>
                  setValue("banner_url", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Company name" error={errors.name?.message}>
                <Input
                  id="name"
                  placeholder="Acme Technologies"
                  aria-invalid={Boolean(errors.name)}
                  disabled={saving}
                  {...register("name")}
                />
              </Field>
              <Field id="slug" label="Slug" error={errors.slug?.message}>
                <Input
                  id="slug"
                  placeholder="acme-technologies"
                  aria-invalid={Boolean(errors.slug)}
                  disabled={saving}
                  {...register("slug")}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="website"
                label="Website"
                error={errors.website?.message}
              >
                <Input
                  id="website"
                  placeholder="https://example.com"
                  aria-invalid={Boolean(errors.website)}
                  disabled={saving}
                  {...register("website")}
                />
              </Field>
              <Field
                id="industry"
                label="Industry"
                error={errors.industry?.message}
              >
                <Input
                  id="industry"
                  list="industry-suggestions"
                  placeholder="Software"
                  aria-invalid={Boolean(errors.industry)}
                  disabled={saving}
                  {...register("industry")}
                />
                <datalist id="industry-suggestions">
                  {INDUSTRY_SUGGESTIONS.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </Field>
            </div>

            <Field
              id="company_size"
              label="Company size"
              error={errors.company_size?.message}
            >
              <select
                id="company_size"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                disabled={saving}
                {...register("company_size")}
              >
                <option value="">Select size</option>
                {COMPANY_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                    value={
                      /^#[0-9A-Fa-f]{6}$/.test(values.primary_color)
                        ? values.primary_color
                        : "#0F766E"
                    }
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
                      /^#[0-9A-Fa-f]{6}$/.test(values.secondary_color)
                        ? values.secondary_color
                        : "#F8FAFC"
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

            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
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

          <CardFooter className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
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
                  : "Save"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <BrandPreview
          name={values.name}
          slug={values.slug}
          logoUrl={values.logo_url || null}
          bannerUrl={values.banner_url || null}
          primaryColor={values.primary_color}
          secondaryColor={values.secondary_color}
          industry={values.industry}
          companySize={
            COMPANY_SIZE_OPTIONS.find(
              (option) => option.value === values.company_size,
            )?.label ?? values.company_size
          }
        />
      </div>
    </div>
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
