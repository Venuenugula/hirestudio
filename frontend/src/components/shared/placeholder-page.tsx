import { Inbox } from "lucide-react"
import type { ReactNode } from "react"

import { EmptyState } from "@/components/shared/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PlaceholderPageProps = {
  title: string
  description: string
  emptyTitle: string
  emptyDescription: string
  children?: ReactNode
}

export function PlaceholderPage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  children,
}: PlaceholderPageProps) {
  return (
    <PageContainer>
      <PageHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            This screen is a placeholder. Feature UI will land in a later phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
          <EmptyState
            icon={Inbox}
            title={emptyTitle}
            description={emptyDescription}
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
