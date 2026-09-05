import type { ReactNode } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBenefitItem } from "@/features/pages/lib/page-config"
import {
  ABOUT_VARIANTS,
  BENEFITS_VARIANTS,
  CTA_VARIANTS,
  HERO_VARIANTS,
  JOBS_VARIANTS,
} from "@/features/pages/lib/design-system"
import type { BenefitItem, PageSection } from "@/features/pages/types"

type SectionFieldsProps = {
  section: PageSection
  disabled?: boolean
  onChange: (sectionId: string, patch: Partial<PageSection>) => void
}

export function SectionFields({ section, disabled, onChange }: SectionFieldsProps) {
  return (
    <div className="space-y-5 border-t border-border px-5 py-5">
      <VariantSelect
        section={section}
        disabled={disabled}
        onChange={onChange}
      />

      {"title" in section ? (
        <Field label="Title" htmlFor={`${section.id}-title`} required>
          <Input
            id={`${section.id}-title`}
            value={section.title}
            disabled={disabled}
            required
            aria-required
            onChange={(event) =>
              onChange(section.id, { title: event.target.value })
            }
          />
        </Field>
      ) : null}

      {section.type === "hero" ? (
        <>
          <Field label="Subtitle" htmlFor={`${section.id}-subtitle`} required>
            <Input
              id={`${section.id}-subtitle`}
              value={section.subtitle}
              disabled={disabled}
              required
              aria-required
              onChange={(event) =>
                onChange(section.id, { subtitle: event.target.value })
              }
            />
          </Field>
          <Field label="CTA label" htmlFor={`${section.id}-cta`} required>
            <Input
              id={`${section.id}-cta`}
              value={section.ctaLabel}
              disabled={disabled}
              required
              aria-required
              onChange={(event) =>
                onChange(section.id, { ctaLabel: event.target.value })
              }
            />
          </Field>
        </>
      ) : null}

      {section.type === "about" ? (
        <Field label="Body" htmlFor={`${section.id}-body`} required>
          <Textarea
            id={`${section.id}-body`}
            value={section.body}
            disabled={disabled}
            rows={6}
            required
            aria-required
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
        <Field label="Subtitle" htmlFor={`${section.id}-subtitle`} required>
          <Textarea
            id={`${section.id}-subtitle`}
            value={section.subtitle}
            disabled={disabled}
            rows={3}
            required
            aria-required
            onChange={(event) =>
              onChange(section.id, { subtitle: event.target.value })
            }
          />
        </Field>
      ) : null}

      {section.type === "cta" ? (
        <>
          <Field label="Subtitle" htmlFor={`${section.id}-subtitle`} required>
            <Textarea
              id={`${section.id}-subtitle`}
              value={section.subtitle}
              disabled={disabled}
              rows={3}
              required
              aria-required
              onChange={(event) =>
                onChange(section.id, { subtitle: event.target.value })
              }
            />
          </Field>
          <Field label="Button label" htmlFor={`${section.id}-button`} required>
            <Input
              id={`${section.id}-button`}
              value={section.buttonLabel}
              disabled={disabled}
              required
              aria-required
              onChange={(event) =>
                onChange(section.id, { buttonLabel: event.target.value })
              }
            />
          </Field>
        </>
      ) : null}
    </div>
  )
}

function VariantSelect({
  section,
  disabled,
  onChange,
}: {
  section: PageSection
  disabled?: boolean
  onChange: (sectionId: string, patch: Partial<PageSection>) => void
}) {
  const options =
    section.type === "hero"
      ? HERO_VARIANTS.map((value) => ({
          value,
          label: labelize(value),
        }))
      : section.type === "about"
        ? ABOUT_VARIANTS.map((value) => ({
            value,
            label: labelize(value),
          }))
        : section.type === "benefits"
          ? BENEFITS_VARIANTS.map((value) => ({
              value,
              label: labelize(value),
            }))
          : section.type === "open_roles"
            ? JOBS_VARIANTS.map((value) => ({
                value,
                label: labelize(value),
              }))
            : CTA_VARIANTS.map((value) => ({
                value,
                label: labelize(value),
              }))

  const value =
    ("variant" in section ? section.variant : undefined) ?? options[0]?.value

  return (
    <Field label="Layout variant" htmlFor={`${section.id}-variant`} required>
      <select
        id={`${section.id}-variant`}
        value={value}
        disabled={disabled}
        required
        aria-required
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        onChange={(event) =>
          onChange(section.id, {
            variant: event.target.value,
          } as Partial<PageSection>)
        }
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

function labelize(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
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
        <Label>
          Benefits
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
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
            className="space-y-3 rounded-lg border border-border bg-muted/20 p-4"
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
            <Field
              label="Title"
              htmlFor={`${sectionId}-${item.id}-title`}
              required
            >
              <Input
                id={`${sectionId}-${item.id}-title`}
                value={item.title}
                disabled={disabled}
                required
                aria-required
                onChange={(event) =>
                  updateItem(item.id, { title: event.target.value })
                }
              />
            </Field>
            <Field
              label="Description"
              htmlFor={`${sectionId}-${item.id}-description`}
              required
            >
              <Textarea
                id={`${sectionId}-${item.id}-description`}
                value={item.description}
                disabled={disabled}
                rows={3}
                required
                aria-required
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
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </Label>
      {children}
    </div>
  )
}
