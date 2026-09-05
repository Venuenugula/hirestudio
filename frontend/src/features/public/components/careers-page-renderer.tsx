import {
  isSectionVisible,
  sortSectionsForPublic,
} from "@/features/pages/lib/page-config"
import type { PageConfig, PageSection, PageTheme } from "@/features/pages/types"
import type { Company } from "@/features/company/types"
import type { Job } from "@/features/jobs/types"
import { PublicAbout } from "@/features/public/components/public-about"
import { PublicBenefits } from "@/features/public/components/public-benefits"
import { PublicCta } from "@/features/public/components/public-cta"
import { PublicFooter } from "@/features/public/components/public-footer"
import { PublicHero } from "@/features/public/components/public-hero"
import { PublicJobList } from "@/features/public/components/public-job-list"
import { PublicShell } from "@/features/public/components/public-shell"
import { resolvePublicTheme } from "@/features/public/lib/theme"
import { cn } from "@/lib/utils"

export type CareersPageCompany = Pick<
  Company,
  "name" | "logo_url" | "primary_color" | "secondary_color"
>

type CareersPageRendererProps = {
  config: PageConfig
  company: CareersPageCompany
  jobs: Job[]
  slug: string
  disableNavigation?: boolean
  className?: string
}

/**
 * Single renderer for public careers + live preview.
 * Only the config source differs (published vs draft).
 */
export function CareersPageRenderer({
  config,
  company,
  jobs,
  slug,
  disableNavigation = false,
  className,
}: CareersPageRendererProps) {
  const theme = resolvePublicTheme(
    {
      theme: config.theme as unknown as Record<string, unknown>,
    },
    company,
  )
  const visibleSections = sortSectionsForPublic(
    config.sections.filter(isSectionVisible),
  )
  const hasOpenRolesSection = config.sections.some(
    (section) => section.type === "open_roles",
  )

  const scrollToJobs = () => {
    document.getElementById("open-roles")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <PublicShell company={company} theme={theme} className={cn(className)}>
      {visibleSections.map((section) => (
        <CareersPageSection
          key={section.id}
          section={section}
          companyName={company.name}
          jobs={jobs}
          slug={slug}
          theme={theme}
          disableNavigation={disableNavigation}
          onScrollToJobs={scrollToJobs}
        />
      ))}
      {!hasOpenRolesSection ? (
        <PublicJobList
          jobs={jobs}
          slug={slug}
          companyName={company.name}
          disableNavigation={disableNavigation}
        />
      ) : null}
      <PublicFooter companyName={company.name} />
    </PublicShell>
  )
}

function CareersPageSection({
  section,
  companyName,
  jobs,
  slug,
  theme,
  disableNavigation,
  onScrollToJobs,
}: {
  section: PageSection
  companyName: string
  jobs: Job[]
  slug: string
  theme: PageTheme
  disableNavigation: boolean
  onScrollToJobs: () => void
}) {
  if (section.type === "hero") {
    return (
      <PublicHero
        section={section}
        companyName={companyName}
        buttonStyle={theme.buttonStyle}
        onCtaClick={onScrollToJobs}
      />
    )
  }

  if (section.type === "about") {
    return <PublicAbout section={section} />
  }

  if (section.type === "benefits") {
    return <PublicBenefits section={section} />
  }

  if (section.type === "open_roles") {
    return (
      <PublicJobList
        jobs={jobs}
        slug={slug}
        companyName={companyName}
        disableNavigation={disableNavigation}
        section={section}
      />
    )
  }

  return (
    <PublicCta
      section={section}
      buttonStyle={theme.buttonStyle}
      onButtonClick={onScrollToJobs}
    />
  )
}
