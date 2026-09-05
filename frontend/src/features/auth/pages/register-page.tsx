import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  registerDefaults,
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth-schema"
import { toastError, toastSuccess } from "@/lib/toast"
import { useAuth } from "@/providers/auth-provider"
import { routes } from "@/routes/paths"

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerAccount } = useAuth()
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaults,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Register your company and start building your careers page.
        </p>
      </div>

      <form
        className="space-y-4 rounded-xl border border-border bg-card p-6"
        onSubmit={handleSubmit(async (values) => {
          try {
            await registerAccount({
              ...values,
              company_slug: values.company_slug.toLowerCase(),
            })
            toastSuccess("Workspace ready")
            navigate(routes.dashboard, { replace: true })
          } catch (error) {
            toastError(error, "Unable to register")
          }
        })}
        noValidate
      >
        <Field label="Full name" error={errors.full_name?.message}>
          <Input autoComplete="name" {...register("full_name")} />
        </Field>
        <Field label="Work email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </Field>
        <Field label="Company name" error={errors.company_name?.message}>
          <Input {...register("company_name")} />
        </Field>
        <Field label="Company slug" error={errors.company_slug?.message}>
          <Input placeholder="acme-corp" {...register("company_slug")} />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating workspace..." : "Create workspace"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-foreground underline-offset-4 hover:underline" to={routes.login}>
          Sign in
        </Link>
      </p>
    </div>
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
