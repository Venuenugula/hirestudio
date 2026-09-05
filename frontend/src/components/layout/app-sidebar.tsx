import {
  BriefcaseBusiness,
  Building2,
  Layers,
  LayoutDashboard,
  FileStack,
} from "lucide-react"
import { NavLink } from "react-router-dom"

import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/providers/auth-provider"
import { routes } from "@/routes/paths"
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "Workspace",
    items: [
      { to: routes.dashboard, label: "Dashboard", icon: LayoutDashboard },
      { to: routes.company, label: "Company", icon: Building2 },
    ],
  },
  {
    label: "Careers",
    items: [
      { to: routes.careersPage, label: "Page editor", icon: FileStack },
      { to: routes.jobs, label: "Jobs", icon: BriefcaseBusiness },
    ],
  },
] as const

type AppSidebarProps = {
  onNavigate?: () => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const { user, company } = useAuth()
  const initials =
    user?.full_name
      ?.split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "R"

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm">
          <Layers className="size-4" aria-hidden />
        </span>
        <NavLink
          to={routes.home}
          onClick={onNavigate}
          className="text-sm font-semibold tracking-tight text-sidebar-foreground"
        >
          HireStudio
        </NavLink>
      </div>
      <Separator className="bg-sidebar-border" />
      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3" aria-label="Main">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-semibold tracking-[0.14em] text-sidebar-foreground/45 uppercase">
              {group.label}
            </p>
            {group.items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-sky-500/20 font-medium text-sky-100 before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-sky-400"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                  )
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/25 text-xs font-semibold text-sky-100">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.full_name || "Recruiter"}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/55">
              {user?.email || company?.name || "Workspace"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
