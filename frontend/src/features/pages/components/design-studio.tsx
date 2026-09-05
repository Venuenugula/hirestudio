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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DesignStudioProps = {
  theme: PageTheme
  disabled?: boolean
  onChange: (theme: Partial<PageTheme>) => void
  onApplyStyle: (styleId: PageStyleId) => void
}

export function DesignStudio({
  theme,
  disabled,
  onChange,
  onApplyStyle,
}: DesignStudioProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Page style</CardTitle>
          <CardDescription>
            Presets change typography, radius, buttons, and section layouts at once.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {PAGE_STYLE_PRESETS.map((preset) => {
            const active = (theme.styleId ?? "professional") === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => onApplyStyle(preset.id)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left transition-colors",
                  active
                    ? "border-teal-700 bg-teal-50"
                    : "border-border hover:bg-accent",
                  disabled && "opacity-50",
                )}
              >
                <p className="text-sm font-semibold">{preset.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {preset.description}
                </p>
              </button>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme packs</CardTitle>
          <CardDescription>
            One-click color systems. You can still override manually below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      ? "border-foreground"
                      : "border-border hover:bg-accent",
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
                  ? "border-foreground"
                  : "border-border hover:bg-accent",
              )}
            >
              Custom
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              id="primaryColor"
              label="Primary color"
              value={theme.primaryColor}
              disabled={disabled}
              onChange={(primaryColor) =>
                onChange({ primaryColor, themePackId: "custom" })
              }
            />
            <ColorField
              id="secondaryColor"
              label="Secondary color"
              value={theme.secondaryColor}
              disabled={disabled}
              onChange={(secondaryColor) =>
                onChange({ secondaryColor, themePackId: "custom" })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography & controls</CardTitle>
          <CardDescription>
            Fine-tune font, corner radius, and button style.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
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
        </CardContent>
      </Card>
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
    <div className="space-y-2">
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
    <label className="space-y-2 text-sm">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
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
