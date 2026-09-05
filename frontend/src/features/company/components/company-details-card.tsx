import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Company } from "@/features/company/types"

type CompanyDetailsCardProps = {
  company: Company
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm break-all text-foreground">{value}</dd>
    </div>
  )
}

export function CompanyDetailsCard({ company }: CompanyDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company details</CardTitle>
        <CardDescription>Current saved branding for this tenant.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl>
          <DetailRow label="Name" value={company.name} />
          <DetailRow label="Slug" value={company.slug} />
          <DetailRow
            label="Logo URL"
            value={
              company.logo_url ?? (
                <span className="text-muted-foreground">Not set</span>
              )
            }
          />
          <DetailRow
            label="Banner URL"
            value={
              company.banner_url ?? (
                <span className="text-muted-foreground">Not set</span>
              )
            }
          />
          <DetailRow
            label="Primary color"
            value={
              <span className="inline-flex items-center gap-2">
                <span
                  className="size-4 rounded-sm border border-border"
                  style={{ backgroundColor: company.primary_color }}
                  aria-hidden
                />
                {company.primary_color}
              </span>
            }
          />
          <DetailRow
            label="Secondary color"
            value={
              <span className="inline-flex items-center gap-2">
                <span
                  className="size-4 rounded-sm border border-border"
                  style={{ backgroundColor: company.secondary_color }}
                  aria-hidden
                />
                {company.secondary_color}
              </span>
            }
          />
          <DetailRow
            label="Status"
            value={company.is_active ? "Active" : "Inactive"}
          />
        </dl>
      </CardContent>
    </Card>
  )
}
