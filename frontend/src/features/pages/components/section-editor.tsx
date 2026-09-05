import type { ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PageSection } from "@/features/pages/types"

type SectionEditorProps = {
  section: PageSection | null
  disabled?: boolean
  onChange: (sectionId: string, patch: Partial<PageSection>) => void
}

export function SectionEditor({ section, disabled, onChange }: SectionEditorProps) {
  if (!section) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Section editor</CardTitle>
          <CardDescription>Select a section to edit its content.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No section selected.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{section.type} section</CardTitle>
        <CardDescription>Edits apply to the draft and live preview.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label="Title" htmlFor={`${section.id}-title`}>
          <Input
            id={`${section.id}-title`}
            value={section.title}
            disabled={disabled}
            onChange={(event) =>
              onChange(section.id, { title: event.target.value })
            }
          />
        </Field>

        {section.type === "hero" ? (
          <>
            <Field label="Subtitle" htmlFor={`${section.id}-subtitle`}>
              <Input
                id={`${section.id}-subtitle`}
                value={section.subtitle}
                disabled={disabled}
                onChange={(event) =>
                  onChange(section.id, { subtitle: event.target.value })
                }
              />
            </Field>
            <Field label="CTA label" htmlFor={`${section.id}-cta`}>
              <Input
                id={`${section.id}-cta`}
                value={section.ctaLabel}
                disabled={disabled}
                onChange={(event) =>
                  onChange(section.id, { ctaLabel: event.target.value })
                }
              />
            </Field>
          </>
        ) : (
          <Field label="Body" htmlFor={`${section.id}-body`}>
            <Textarea
              id={`${section.id}-body`}
              value={section.body}
              disabled={disabled}
              onChange={(event) =>
                onChange(section.id, { body: event.target.value })
              }
            />
          </Field>
        )}
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
