import type { CtaSection } from "@/features/pages/types"

type PublicCtaProps = {
  section: CtaSection
  onButtonClick?: () => void
}

export function PublicCta({ section, onButtonClick }: PublicCtaProps) {
  return (
    <section className="border-t border-black/10 px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {section.title || "Ready to join us?"}
        </h2>
        {section.subtitle ? (
          <p className="mx-auto max-w-xl text-sm opacity-80 md:text-base">
            {section.subtitle}
          </p>
        ) : null}
        {section.buttonLabel ? (
          <button
            type="button"
            onClick={onButtonClick}
            className="rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--public-primary)",
              color: "var(--public-secondary)",
            }}
          >
            {section.buttonLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}
