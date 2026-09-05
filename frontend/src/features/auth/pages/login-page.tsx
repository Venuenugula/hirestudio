import { PlaceholderPage } from "@/components/shared/placeholder-page"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <PlaceholderPage
        title="Login"
        description="Authentication UI will be implemented in a later phase."
        emptyTitle="No auth form yet"
        emptyDescription="Email/password login and JWT session handling come next."
      >
        <Card className="border-dashed shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Planned</CardTitle>
            <CardDescription>
              Sign in, protected routes, and session storage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This route uses the auth layout without the app sidebar.
            </p>
          </CardContent>
        </Card>
      </PlaceholderPage>
    </div>
  )
}
