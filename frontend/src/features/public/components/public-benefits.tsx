import type { BenefitsSection } from "@/features/pages/types"

type PublicBenefitsProps = {
  section: BenefitsSection
}

export function PublicBenefits({ section }: PublicBenefitsProps) {
  return (
    <section className="border-t border-black/10 px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {section.title || "Why you'll love working here"}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {section.items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-black/10 px-4 py-4"
            >
              <h3 className="font-medium">{item.title}</h3>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed opacity-80">
                  {item.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
