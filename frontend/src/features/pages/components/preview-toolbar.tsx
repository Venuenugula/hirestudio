import {
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Tablet,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  MAX_PREVIEW_ZOOM,
  MIN_PREVIEW_ZOOM,
  PREVIEW_DEVICES,
  type PreviewDevice,
} from "@/features/pages/lib/preview-devices"
import { cn } from "@/lib/utils"

type PreviewToolbarProps = {
  device: PreviewDevice
  zoom: number
  fitWidth: boolean
  fullscreen: boolean
  onDeviceChange: (device: PreviewDevice) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFitWidthToggle: () => void
  onFullscreenToggle: () => void
}

const DEVICE_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} as const

export function PreviewToolbar({
  device,
  zoom,
  fitWidth,
  fullscreen,
  onDeviceChange,
  onZoomIn,
  onZoomOut,
  onFitWidthToggle,
  onFullscreenToggle,
}: PreviewToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
      <div
        className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5"
        role="group"
        aria-label="Preview device"
      >
        {PREVIEW_DEVICES.map((preset) => {
          const Icon = DEVICE_ICONS[preset.id]
          const active = device === preset.id
          return (
            <Button
              key={preset.id}
              type="button"
              size="sm"
              variant={active ? "secondary" : "ghost"}
              className={cn(
                "h-8 gap-1.5 px-2.5",
                active && "bg-background shadow-xs",
              )}
              aria-pressed={active}
              onClick={() => onDeviceChange(preset.id)}
            >
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{preset.label}</span>
            </Button>
          )
        })}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Zoom out"
          disabled={fitWidth || zoom <= MIN_PREVIEW_ZOOM}
          onClick={onZoomOut}
        >
          <ZoomOut className="size-4" />
        </Button>
        <span className="min-w-12 text-center text-xs font-medium tabular-nums text-muted-foreground">
          {fitWidth ? "Fit" : `${zoom}%`}
        </span>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Zoom in"
          disabled={fitWidth || zoom >= MAX_PREVIEW_ZOOM}
          onClick={onZoomIn}
        >
          <ZoomIn className="size-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={fitWidth ? "secondary" : "ghost"}
          aria-pressed={fitWidth}
          onClick={onFitWidthToggle}
        >
          Fit Width
        </Button>

        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={fullscreen ? "Exit fullscreen preview" : "Fullscreen preview"}
          onClick={onFullscreenToggle}
        >
          {fullscreen ? (
            <Minimize2 className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
