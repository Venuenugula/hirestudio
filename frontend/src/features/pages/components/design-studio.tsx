import {
  BUTTON_STYLE_OPTIONS,
  FONT_OPTIONS,
  PAGE_STYLE_PRESETS,
  RADIUS_OPTIONS,
  THEME_PACKS,
  themeFromPack,
  type PageStyleId,
  type ThemePackId,
} from "@/features/pages/lib/design-system"
import type { PageTheme } from "@/features/pages/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type DesignStudioProps = {
  theme: PageTheme
  disabled?: boolean
  onChange: (theme: Partial<PageTheme>) => void
  onApplyStyle: (styleId: PageStyleId) => void
  /** Compact layout for accordion / certificate-style editor. */
  compact?: boolean
}

export function DesignStudio({
  theme,
  disabled,
  onChange,
  onApplyStyle,
  compact = false,
}: DesignStudioProps) {
  return (
    <div className={cn("space-y-5", compact && "space-y-4")}>
      <section className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Style
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PAGE_STYLE_PRESETS.map((preset) => {
            const active = (theme.styleId ?? "professional") === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => onApplyStyle(preset.id)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-background hover:bg-accent",
                  disabled && "opacity-50",
                )}
              >
                <p className="text-sm font-semibold">{preset.name}</p>
                {!compact ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {preset.description}
                  </p>
                ) : null}
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Theme
        </p>
        <div className="flex flex-wrap gap-2">
          {THEME_PACKS.map((pack) => {
            const active = theme.themePackId === pack.id
            return (
              <button
                key={pack.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  const next = themeFromPack(pack.id as ThemePackId)
                  if (next) {
                    onChange(next)
                  }
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                  active
                    ? "border-foreground bg-background"
                    : "border-border bg-background hover:bg-accent",
                )}
              >
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: pack.primaryColor }}
                />
                {pack.name}
              </button>
            )
          })}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ themePackId: "custom" })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              theme.themePackId === "custom" || !theme.themePackId
                ? "border-foreground bg-background"
                : "border-border bg-background hover:bg-accent",
            )}
          >
            Custom
          </button>
        </div>

        <div className="grid gap-4 pt-1 sm:grid-cols-2">
          <ColorField
            id="primaryColor"
            label="Primary"
            value={theme.primaryColor}
            disabled={disabled}
            onChange={(primaryColor) =>
              onChange({ primaryColor, themePackId: "custom" })
            }
          />
          <ColorField
            id="secondaryColor"
            label="Secondary"
            value={theme.secondaryColor}
            disabled={disabled}
            onChange={(secondaryColor) =>
              onChange({ secondaryColor, themePackId: "custom" })
            }
          />
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Typography & controls
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField
            label="Font"
            value={theme.fontId ?? "inter"}
            disabled={disabled}
            options={FONT_OPTIONS.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            onChange={(fontId) =>
              onChange({ fontId: fontId as PageTheme["fontId"] })
            }
          />
          <SelectField
            label="Radius"
            value={theme.radiusId ?? "modern"}
            disabled={disabled}
            options={RADIUS_OPTIONS.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            onChange={(radiusId) =>
              onChange({ radiusId: radiusId as PageTheme["radiusId"] })
            }
          />
          <SelectField
            label="Button"
            value={theme.buttonStyle ?? "filled"}
            disabled={disabled}
            options={BUTTON_STYLE_OPTIONS.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            onChange={(buttonStyle) =>
              onChange({
                buttonStyle: buttonStyle as PageTheme["buttonStyle"],
              })
            }
          />
        </div>
      </section>
    </div>
  )
}

function ColorField({
  id,
  label,
  value,
  disabled,
  onChange,
}: {
  id: string
  label: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}) {
  const pickerValue = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#0F766E"
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          className="h-9 w-14 cursor-pointer p-1"
          value={pickerValue}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <Input
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  disabled?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
