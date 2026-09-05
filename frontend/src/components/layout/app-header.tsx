import { Link } from "react-router-dom"
import { Building2, ExternalLink, Menu } from "lucide-react"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { routes } from "@/routes/paths"

type AppHeaderProps = {
  title?: string
  onMenuClick?: () => void
}

export function AppHeader({ title = "Workspace", onMenuClick }: AppHeaderProps) {
  const { user, company, logout, isAuthenticated } = useAuth()

  const workspaceLabel = company?.name
    ? `${company.name}${user?.full_name ? ` - ${user.full_name}` : ""}`
    : "Recruiter workspace"

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={onMenuClick}
      >
        <Menu className="size-4" />
      </Button>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Building2
            className="hidden size-4 shrink-0 text-muted-foreground sm:block"
            aria-hidden
          />
          <p className="truncate text-muted-foreground">
            <span className="font-medium text-foreground">{title}</span>
            <span className="mx-1.5 text-border">/</span>
            <span>{workspaceLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {company?.slug ? (
                <Button asChild variant="outline" size="sm">
                  <Link to={routes.publicCareers(company.slug)} target="_blank">
                    <ExternalLink className="size-3.5" />
                    View Public Site
                  </Link>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void logout()}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to={routes.login}>Login</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
