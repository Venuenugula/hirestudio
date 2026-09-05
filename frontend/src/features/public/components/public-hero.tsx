import type { HeroSection, PageTheme } from "@/features/pages/types"
import { PublicBrandButton } from "@/features/public/components/public-brand-button"
import { cn } from "@/lib/utils"

type PublicHeroProps = {
  section: HeroSection
  companyName: string
  buttonStyle?: PageTheme["buttonStyle"]
  onCtaClick?: () => void
}

export function PublicHero({
  section,
  companyName,
  buttonStyle = "filled",
  onCtaClick,
}: PublicHeroProps) {
  const variant = section.variant ?? "stacked"
  const isCentered = variant === "centered"
  const isBanner = variant === "banner"
  const isSplit = variant === "split"

  return (
    <section
      className={cn(
        "relative overflow-hidden px-4 py-16 md:px-8 md:py-24",
        isBanner && "bg-[var(--public-primary)] text-white",
      )}
    >
      {!isBanner ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% 0%, color-mix(in srgb, var(--public-primary) 22%, transparent), transparent), radial-gradient(ellipse 55% 45% at 92% 8%, color-mix(in srgb, var(--public-secondary) 55%, transparent), transparent), radial-gradient(ellipse 40% 35% at 70% 40%, color-mix(in srgb, var(--public-primary) 10%, transparent), transparent)",
          }}
          aria-hidden
        />
      ) : null}

      <div
        className={cn(
          "relative mx-auto max-w-5xl",
          isSplit && "grid items-center gap-10 md:grid-cols-2",
          isCentered && "text-center",
        )}
      >
        <div className={cn("space-y-5", isCentered && "mx-auto max-w-3xl")}>
          <p
            className={cn(
              "text-xs font-semibold tracking-[0.2em] uppercase",
              isBanner ? "text-white/75" : "text-[var(--public-primary)]",
            )}
          >
            Careers at {companyName}
          </p>
          <h1
            className={cn(
              "max-w-3xl font-semibold tracking-tight",
              isCentered
                ? "mx-auto text-4xl md:text-6xl"
                : "text-4xl md:text-5xl lg:text-6xl",
              isBanner ? "text-white" : "text-[var(--public-foreground)]",
            )}
          >
            {section.title || "Join our team"}
          </h1>
          {section.subtitle ? (
            <p
              className={cn(
                "max-w-2xl text-base md:text-lg",
                isCentered && "mx-auto",
                isBanner ? "text-white/85" : "text-[var(--public-muted)]",
              )}
            >
              {section.subtitle}
            </p>
          ) : null}
          {section.ctaLabel ? (
            <div className={cn(isCentered && "flex justify-center")}>
              <PublicBrandButton
                buttonStyle={buttonStyle}
                tone={isBanner ? "on-dark" : "on-light"}
                onClick={onCtaClick}
              >
                {section.ctaLabel}
              </PublicBrandButton>
            </div>
          ) : null}
        </div>

        {isSplit ? (
          <div
            className="relative hidden min-h-64 overflow-hidden rounded-[var(--public-radius)] border border-[var(--public-border)] bg-[var(--public-surface)] p-6 shadow-sm md:block"
            aria-hidden
          >
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--public-primary) 28%, transparent), transparent 55%), radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--public-primary) 16%, transparent), transparent 50%)",
              }}
            />
            <div className="relative space-y-4">
              <div className="h-3 w-24 rounded-full bg-[var(--public-primary)]/30" />
              <div className="h-8 w-3/4 rounded-lg bg-[var(--public-foreground)]/10" />
              <div className="h-8 w-1/2 rounded-lg bg-[var(--public-foreground)]/10" />
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-[var(--public-radius)] bg-[var(--public-hover)] p-4">
                  <p className="text-2xl font-semibold text-[var(--public-primary)]">
                    150+
                  </p>
                  <p className="text-xs text-[var(--public-muted)]">Open roles</p>
                </div>
                <div className="rounded-[var(--public-radius)] bg-[var(--public-hover)] p-4">
                  <p className="text-2xl font-semibold text-[var(--public-primary)]">
                    12
                  </p>
                  <p className="text-xs text-[var(--public-muted)]">Teams</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
