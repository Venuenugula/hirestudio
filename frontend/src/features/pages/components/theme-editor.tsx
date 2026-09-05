import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PageTheme } from "@/features/pages/types"

type ThemeEditorProps = {
  theme: PageTheme
  disabled?: boolean
  onChange: (theme: Partial<PageTheme>) => void
}

export function ThemeEditor({ theme, disabled, onChange }: ThemeEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Colors update the live preview immediately and apply to the public site after you publish.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <ColorField
          id="primaryColor"
          label="Primary color"
          value={theme.primaryColor}
          disabled={disabled}
          onChange={(primaryColor) => onChange({ primaryColor })}
        />
        <ColorField
          id="secondaryColor"
          label="Secondary color"
          value={theme.secondaryColor}
          disabled={disabled}
          onChange={(secondaryColor) => onChange({ secondaryColor })}
        />
      </CardContent>
    </Card>
  )
}

type ColorFieldProps = {
  id: string
  label: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}

function ColorField({ id, label, value, disabled, onChange }: ColorFieldProps) {
  const pickerValue = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#111111"

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
