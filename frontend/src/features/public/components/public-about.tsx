import type { AboutSection } from "@/features/pages/types"

type PublicAboutProps = {
  section: AboutSection
}

export function PublicAbout({ section }: PublicAboutProps) {
  return (
    <section className="border-t border-black/10 px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {section.title || "About us"}
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed opacity-80 md:text-base">
          {section.body}
        </p>
      </div>
    </section>
  )
}
