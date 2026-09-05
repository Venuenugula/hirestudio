import type { HeroSection } from "@/features/pages/types"

type PublicHeroProps = {
  section: HeroSection
  companyName: string
  onCtaClick?: () => void
}

export function PublicHero({
  section,
  companyName,
  onCtaClick,
}: PublicHeroProps) {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl space-y-5">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
          Careers at {companyName}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          {section.title || "Join our team"}
        </h1>
        {section.subtitle ? (
          <p className="max-w-2xl text-base opacity-80 md:text-lg">
            {section.subtitle}
          </p>
        ) : null}
        {section.ctaLabel ? (
          <button
            type="button"
            onClick={onCtaClick}
            className="rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--public-primary)",
              color: "var(--public-secondary)",
            }}
          >
            {section.ctaLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}
