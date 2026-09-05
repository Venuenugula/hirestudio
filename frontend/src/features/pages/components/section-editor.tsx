import type { ReactNode } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import {
  createBenefitItem,
  sectionLabel,
} from "@/features/pages/lib/page-config"
import type { BenefitItem, PageSection } from "@/features/pages/types"

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
        <CardTitle>{sectionLabel(section.type)} section</CardTitle>
        <CardDescription>Edits apply to the draft and live preview.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {"title" in section ? (
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
        ) : null}

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
        ) : null}

        {section.type === "about" ? (
          <Field label="Body" htmlFor={`${section.id}-body`}>
            <Textarea
              id={`${section.id}-body`}
              value={section.body}
              disabled={disabled}
              rows={6}
              onChange={(event) =>
                onChange(section.id, { body: event.target.value })
              }
            />
          </Field>
        ) : null}

        {section.type === "benefits" ? (
          <BenefitsItemsEditor
            sectionId={section.id}
            items={section.items}
            disabled={disabled}
            onChange={(items) => onChange(section.id, { items })}
          />
        ) : null}

        {section.type === "open_roles" ? (
          <Field label="Subtitle" htmlFor={`${section.id}-subtitle`}>
            <Textarea
              id={`${section.id}-subtitle`}
              value={section.subtitle}
              disabled={disabled}
              rows={3}
              onChange={(event) =>
                onChange(section.id, { subtitle: event.target.value })
              }
            />
          </Field>
        ) : null}

        {section.type === "cta" ? (
          <>
            <Field label="Subtitle" htmlFor={`${section.id}-subtitle`}>
              <Textarea
                id={`${section.id}-subtitle`}
                value={section.subtitle}
                disabled={disabled}
                rows={3}
                onChange={(event) =>
                  onChange(section.id, { subtitle: event.target.value })
                }
              />
            </Field>
            <Field label="Button label" htmlFor={`${section.id}-button`}>
              <Input
                id={`${section.id}-button`}
                value={section.buttonLabel}
                disabled={disabled}
                onChange={(event) =>
                  onChange(section.id, { buttonLabel: event.target.value })
                }
              />
            </Field>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function BenefitsItemsEditor({
  sectionId,
  items,
  disabled,
  onChange,
}: {
  sectionId: string
  items: BenefitItem[]
  disabled?: boolean
  onChange: (items: BenefitItem[]) => void
}) {
  const updateItem = (itemId: string, patch: Partial<BenefitItem>) => {
    onChange(
      items.map((item) =>
        item.id === itemId ? { ...item, ...patch, id: item.id } : item,
      ),
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label>Benefits</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={() => onChange([...items, createBenefitItem()])}
        >
          <Plus className="size-4" />
          Add benefit
        </Button>
      </div>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="space-y-3 rounded-md border border-border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Benefit {index + 1}</p>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                disabled={disabled || items.length <= 1}
                aria-label={`Remove benefit ${index + 1}`}
                onClick={() =>
                  onChange(items.filter((entry) => entry.id !== item.id))
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <Field label="Title" htmlFor={`${sectionId}-${item.id}-title`}>
              <Input
                id={`${sectionId}-${item.id}-title`}
                value={item.title}
                disabled={disabled}
                onChange={(event) =>
                  updateItem(item.id, { title: event.target.value })
                }
              />
            </Field>
            <Field
              label="Description"
              htmlFor={`${sectionId}-${item.id}-description`}
            >
              <Textarea
                id={`${sectionId}-${item.id}-description`}
                value={item.description}
                disabled={disabled}
                rows={3}
                onChange={(event) =>
                  updateItem(item.id, { description: event.target.value })
                }
              />
            </Field>
          </li>
        ))}
      </ul>
    </div>
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
