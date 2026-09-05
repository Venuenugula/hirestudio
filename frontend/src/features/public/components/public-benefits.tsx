import { Sparkles } from "lucide-react"

import type { BenefitsSection } from "@/features/pages/types"
import { cn } from "@/lib/utils"

type PublicBenefitsProps = {
  section: BenefitsSection
}

export function PublicBenefits({ section }: PublicBenefitsProps) {
  const variant = section.variant ?? "grid"

  return (
    <section className="border-t border-[var(--public-border)] px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--public-foreground)] md:text-3xl">
          {section.title || "Why you'll love working here"}
        </h2>

        {variant === "list" ? (
          <ul className="space-y-4">
            {section.items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <span
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center bg-[var(--public-hover)] text-[var(--public-primary)]"
                  style={{ borderRadius: "var(--public-radius)" }}
                >
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--public-foreground)]">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--public-muted)]">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul
            className={cn(
              "grid gap-4",
              variant === "row"
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : "sm:grid-cols-2",
            )}
          >
            {section.items.map((item) => (
              <li
                key={item.id}
                className="border border-[var(--public-border)] bg-[var(--public-surface)] px-5 py-5 shadow-sm"
                style={{ borderRadius: "var(--public-radius)" }}
              >
                <h3 className="font-semibold text-[var(--public-foreground)]">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--public-muted)]">
                    {item.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
