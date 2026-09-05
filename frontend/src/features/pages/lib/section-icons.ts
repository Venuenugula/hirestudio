import {
  Briefcase,
  Gift,
  LayoutTemplate,
  Megaphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import type { SectionType } from "@/features/pages/types"

export const SECTION_ICONS: Record<SectionType, LucideIcon> = {
  hero: Sparkles,
  about: LayoutTemplate,
  benefits: Gift,
  open_roles: Briefcase,
  cta: Megaphone,
}
