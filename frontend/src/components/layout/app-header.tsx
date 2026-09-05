import { Menu } from "lucide-react"
import { Link } from "react-router-dom"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { routes } from "@/routes/paths"

type AppHeaderProps = {
  title?: string
  onMenuClick?: () => void
}

export function AppHeader({ title = "Workspace", onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
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
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Recruiter workspace foundation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={routes.login}>Login</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
