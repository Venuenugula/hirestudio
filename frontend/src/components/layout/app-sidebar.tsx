import {
  BriefcaseBusiness,
  Building2,
  Layers,
  LayoutDashboard,
  FileStack,
} from "lucide-react"
import { NavLink } from "react-router-dom"

import { Separator } from "@/components/ui/separator"
import { routes } from "@/routes/paths"
import { cn } from "@/lib/utils"

const navItems = [
  { to: routes.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { to: routes.company, label: "Company", icon: Building2 },
  { to: routes.careersPage, label: "Careers Page", icon: FileStack },
  { to: routes.jobs, label: "Jobs", icon: BriefcaseBusiness },
] as const

type AppSidebarProps = {
  onNavigate?: () => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Layers className="size-4" aria-hidden />
        </span>
        <NavLink
          to={routes.home}
          onClick={onNavigate}
          className="text-sm font-semibold tracking-tight text-sidebar-foreground"
        >
          Career Page Builder
        </NavLink>
      </div>
      <Separator />
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )
            }
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
