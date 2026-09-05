import { useParams } from "react-router-dom"

import { ApiError } from "@/api/client"
import { normalizePageConfig } from "@/features/pages/lib/page-config"
import type { PageSection } from "@/features/pages/types"
import type { Job } from "@/features/jobs/types"
import { PublicAbout } from "@/features/public/components/public-about"
import { PublicBenefits } from "@/features/public/components/public-benefits"
import { PublicCta } from "@/features/public/components/public-cta"
import { PublicErrorPage } from "@/features/public/components/public-error-page"
import { PublicFooter } from "@/features/public/components/public-footer"
import { PublicHero } from "@/features/public/components/public-hero"
import { PublicJobList } from "@/features/public/components/public-job-list"
import { PublicShell } from "@/features/public/components/public-shell"
import { PublicSiteSkeleton } from "@/features/public/components/public-skeletons"
import { useDocumentMeta } from "@/features/public/hooks/use-document-meta"
import { usePublicSiteQuery } from "@/features/public/hooks/use-public-site-query"
import {
  buildMetaDescription,
  resolvePublicTheme,
} from "@/features/public/lib/theme"

export function PublicCareersPage() {
  const { slug } = useParams<{ slug: string }>()
  const query = usePublicSiteQuery(slug)

  if (!slug) {
    return (
      <PublicErrorPage
        title="Invalid link"
        message="This careers page URL is missing a company slug."
      />
    )
  }

  if (query.isLoading) {
    return <PublicSiteSkeleton />
  }

  if (query.isError || !query.data) {
    const isNotFound =
      query.error instanceof ApiError && query.error.status === 404

    return (
      <PublicErrorPage
        title={isNotFound ? "Careers page not found" : "Something went wrong"}
        message={
          isNotFound
            ? "We couldn’t find an active careers site for this company."
            : query.error instanceof Error
              ? query.error.message
              : "Failed to load this careers page."
        }
        onRetry={isNotFound ? undefined : () => void query.refetch()}
      />
    )
  }

  return <PublicCareersContent slug={slug} data={query.data} />
}

function PublicCareersContent({
  slug,
  data,
}: {
  slug: string
  data: NonNullable<ReturnType<typeof usePublicSiteQuery>["data"]>
}) {
  const { company, careers_page, jobs } = data
  const publishedConfig = careers_page?.published_config ?? {}
  const pageConfig = normalizePageConfig(publishedConfig)
  const theme = resolvePublicTheme(publishedConfig, company)

  const aboutSection = pageConfig.sections.find(
    (section) => section.type === "about",
  )
  const heroSection = pageConfig.sections.find(
    (section) => section.type === "hero",
  )
  const hasOpenRolesSection = pageConfig.sections.some(
    (section) => section.type === "open_roles",
  )

  useDocumentMeta({
    title: `Careers at ${company.name}`,
    description: buildMetaDescription({
      companyName: company.name,
      aboutBody: aboutSection?.type === "about" ? aboutSection.body : undefined,
      heroSubtitle:
        heroSection?.type === "hero" ? heroSection.subtitle : undefined,
    }),
  })

  const scrollToJobs = () => {
    document.getElementById("open-roles")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <PublicShell company={company} theme={theme}>
      {pageConfig.sections.map((section) => (
        <PublicSection
          key={section.id}
          section={section}
          companyName={company.name}
          jobs={jobs}
          slug={slug}
          onScrollToJobs={scrollToJobs}
        />
      ))}
      {!hasOpenRolesSection ? (
        <PublicJobList jobs={jobs} slug={slug} />
      ) : null}
      <PublicFooter companyName={company.name} />
    </PublicShell>
  )
}

function PublicSection({
  section,
  companyName,
  jobs,
  slug,
  onScrollToJobs,
}: {
  section: PageSection
  companyName: string
  jobs: Job[]
  slug: string
  onScrollToJobs: () => void
}) {
  if (section.type === "hero") {
    return (
      <PublicHero
        section={section}
        companyName={companyName}
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
        section={{ title: section.title, subtitle: section.subtitle }}
      />
    )
  }

  return <PublicCta section={section} onButtonClick={onScrollToJobs} />
}
