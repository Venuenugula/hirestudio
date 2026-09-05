export type PreviewDevice = "desktop" | "tablet" | "mobile"

export type PreviewDevicePreset = {
  id: PreviewDevice
  label: string
  width: number
  minHeight: number
}

export const PREVIEW_DEVICES: PreviewDevicePreset[] = [
  { id: "desktop", label: "Desktop", width: 1280, minHeight: 720 },
  { id: "tablet", label: "Tablet", width: 768, minHeight: 900 },
  { id: "mobile", label: "Mobile", width: 390, minHeight: 760 },
]

export const DEFAULT_PREVIEW_DEVICE: PreviewDevice = "desktop"
export const DEFAULT_PREVIEW_ZOOM = 100
export const MIN_PREVIEW_ZOOM = 50
export const MAX_PREVIEW_ZOOM = 125
export const PREVIEW_ZOOM_STEP = 10

export function getPreviewDevice(device: PreviewDevice): PreviewDevicePreset {
  return (
    PREVIEW_DEVICES.find((preset) => preset.id === device) ?? PREVIEW_DEVICES[0]
  )
}

export function clampPreviewZoom(zoom: number): number {
  return Math.min(MAX_PREVIEW_ZOOM, Math.max(MIN_PREVIEW_ZOOM, zoom))
}
