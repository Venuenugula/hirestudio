import type { CSSProperties } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PageConfig, PageSection } from "@/features/pages/types"

type LivePreviewProps = {
  draft: PageConfig
}

export function LivePreview({ draft }: LivePreviewProps) {
  const { theme, sections } = draft

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Live preview</CardTitle>
        <CardDescription>
          Renders the current draft in real time. Not the published version.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="min-h-[28rem] overflow-hidden border-t border-border"
          style={
            {
              "--preview-primary": theme.primaryColor,
              "--preview-secondary": theme.secondaryColor,
              backgroundColor: theme.secondaryColor,
              color: theme.primaryColor,
            } as CSSProperties
          }
        >
          {sections.length === 0 ? (
            <div className="flex min-h-[28rem] items-center justify-center px-6 text-center text-sm opacity-70">
              Add sections to preview your careers page.
            </div>
          ) : (
            sections.map((section) => (
              <PreviewSection key={section.id} section={section} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PreviewSection({ section }: { section: PageSection }) {
  if (section.type === "hero") {
    return (
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
            Careers
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {section.title || "Untitled hero"}
          </h2>
          <p className="max-w-2xl text-base opacity-80 md:text-lg">
            {section.subtitle || "Add a subtitle for candidates."}
          </p>
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: "var(--preview-primary)",
              color: "var(--preview-secondary)",
            }}
          >
            {section.ctaLabel || "Learn more"}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-black/10 px-6 py-12 md:px-10">
      <div className="mx-auto max-w-3xl space-y-3">
        <h3 className="text-2xl font-semibold tracking-tight">
          {section.title || "About"}
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed opacity-80 md:text-base">
          {section.body || "Add your company story."}
        </p>
      </div>
    </section>
  )
}
