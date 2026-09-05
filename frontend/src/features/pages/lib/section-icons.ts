import {
  BriefcaseBusiness,
  CircleHelp,
  Images,
  LayoutTemplate,
  MessageSquareQuote,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import type { ComingSoonSectionType } from "@/features/pages/lib/page-config"
import type { SectionType } from "@/features/pages/types"

export const SECTION_ICONS: Record<
  SectionType | ComingSoonSectionType,
  LucideIcon
> = {
  hero: LayoutTemplate,
  about: MessageSquareQuote,
  benefits: Sparkles,
  open_roles: BriefcaseBusiness,
  cta: Rocket,
  testimonials: MessageSquareQuote,
  gallery: Images,
  faq: CircleHelp,
}

export function sectionIcon(
  type: SectionType | ComingSoonSectionType,
): LucideIcon {
  return SECTION_ICONS[type]
}
