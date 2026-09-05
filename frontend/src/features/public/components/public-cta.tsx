import type { CtaSection, PageTheme } from "@/features/pages/types"
import { PublicBrandButton } from "@/features/public/components/public-brand-button"
import { cn } from "@/lib/utils"

type PublicCtaProps = {
  section: CtaSection
  buttonStyle?: PageTheme["buttonStyle"]
  onButtonClick?: () => void
}

export function PublicCta({
  section,
  buttonStyle = "filled",
  onButtonClick,
}: PublicCtaProps) {
  const variant = section.variant ?? "solid"

  return (
    <section className="border-t border-[var(--public-border)] px-4 py-14 md:px-8 md:py-20">
      <div
        className={cn(
          "mx-auto max-w-5xl space-y-4 px-6 py-12 text-center md:px-10",
          variant === "minimal" && "bg-transparent",
          variant === "solid" && "bg-[var(--public-primary)] text-white",
          variant === "gradient" && "text-white",
        )}
        style={
          variant === "gradient"
            ? {
                borderRadius: "var(--public-radius)",
                background:
                  "linear-gradient(135deg, var(--public-primary), color-mix(in srgb, var(--public-primary) 55%, #0f172a))",
              }
            : variant === "solid"
              ? { borderRadius: "var(--public-radius)" }
              : undefined
        }
      >
        <h2
          className={cn(
            "text-2xl font-semibold tracking-tight md:text-3xl",
            variant === "minimal" && "text-[var(--public-foreground)]",
          )}
        >
          {section.title || "Ready to join us?"}
        </h2>
        {section.subtitle ? (
          <p
            className={cn(
              "mx-auto max-w-xl text-sm md:text-base",
              variant === "minimal"
                ? "text-[var(--public-muted)]"
                : "text-white/85",
            )}
          >
            {section.subtitle}
          </p>
        ) : null}
        {section.buttonLabel ? (
          <PublicBrandButton
            buttonStyle={variant === "minimal" ? buttonStyle : "filled"}
            tone={variant === "minimal" ? "on-light" : "on-dark"}
            onClick={onButtonClick}
          >
            {section.buttonLabel}
          </PublicBrandButton>
        ) : null}
      </div>
    </section>
  )
}
