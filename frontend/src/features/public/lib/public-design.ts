/** Public careers design tokens — Linear/Ashby-inspired teal + indigo system. */

export const PUBLIC_DESIGN = {
  primary: "#0F766E",
  secondary: "#4F46E5",
  accent: "#14B8A6",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  foreground: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  hover: "#F0FDFA",
} as const

export type JobCardTheme = {
  id: string
  background: string
  border: string
  accent: string
  chip: string
}

/**
 * Enterprise card system — white surfaces with subtle teal accents.
 * Variation is intentional but restrained (not a rainbow of palettes).
 */
export const JOB_CARD_THEMES: JobCardTheme[] = [
  {
    id: "teal-soft",
    background: "#FFFFFF",
    border: "#E2E8F0",
    accent: PUBLIC_DESIGN.primary,
    chip: "#F0FDFA",
  },
  {
    id: "teal-tint",
    background: "#F8FFFE",
    border: "#CCFBF1",
    accent: PUBLIC_DESIGN.primary,
    chip: "#F0FDFA",
  },
  {
    id: "slate-teal",
    background: "#FFFFFF",
    border: "#E2E8F0",
    accent: "#0D9488",
    chip: "#F1F5F9",
  },
]

export function jobCardThemeForId(id: string): JobCardTheme {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return JOB_CARD_THEMES[hash % JOB_CARD_THEMES.length]
}
