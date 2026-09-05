import type { AboutSection } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type PublicAboutProps = {
  section: AboutSection
}

export function PublicAbout({ section }: PublicAboutProps) {
  const variant = section.variant ?? "text"
  const isSplit = variant === "split"

  return (
    <section className="border-t border-[var(--public-border)] px-4 py-12 md:px-8 md:py-16">
      <div
        className={cn(
          "mx-auto max-w-5xl",
          isSplit
            ? "grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start"
            : "space-y-3",
        )}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--public-foreground)] md:text-3xl">
          {section.title || "About us"}
        </h2>
        <p className="max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-[var(--public-muted)] md:text-base md:leading-8">
          {section.body}
        </p>
      </div>
    </section>
  )
}
