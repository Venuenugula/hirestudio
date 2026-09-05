import { useParams } from "react-router-dom"

import { ApiError } from "@/api/client"
import {
  isSectionVisible,
  normalizePageConfig,
} from "@/features/pages/lib/page-config"
import { CareersPageRenderer } from "@/features/public/components/careers-page-renderer"
import { PublicErrorPage } from "@/features/public/components/public-error-page"
import { PublicSiteSkeleton } from "@/features/public/components/public-skeletons"
import { useDocumentMeta } from "@/features/public/hooks/use-document-meta"
import { usePublicSiteQuery } from "@/features/public/hooks/use-public-site-query"
import { buildMetaDescription } from "@/features/public/lib/theme"

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
  const pageConfig = normalizePageConfig(careers_page?.published_config ?? {})
  const visibleSections = pageConfig.sections.filter(isSectionVisible)
  const aboutSection = visibleSections.find((section) => section.type === "about")
  const heroSection = visibleSections.find((section) => section.type === "hero")

  useDocumentMeta({
    title: `Careers at ${company.name}`,
    description: buildMetaDescription({
      companyName: company.name,
      aboutBody: aboutSection?.type === "about" ? aboutSection.body : undefined,
      heroSubtitle:
        heroSection?.type === "hero" ? heroSection.subtitle : undefined,
    }),
  })

  return (
    <CareersPageRenderer
      config={pageConfig}
      company={company}
      jobs={jobs}
      slug={slug}
    />
  )
}
