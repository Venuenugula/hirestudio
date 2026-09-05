import { motion } from "framer-motion"
import {
  Maximize2,
  Minimize2,
  Monitor,
  RotateCcw,
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
  onResetZoom: () => void
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
  onResetZoom,
  onFitWidthToggle,
  onFullscreenToggle,
}: PreviewToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2.5">
      <div
        className="inline-flex gap-0.5 rounded-lg border border-border bg-background p-0.5"
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
              variant={active ? "default" : "outline"}
              className={cn(
                "relative h-8 gap-1.5 border px-2.5 shadow-none",
                active
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
              )}
              aria-pressed={active}
              title={`${preset.label} (${preset.width}px)`}
              onClick={() => onDeviceChange(preset.id)}
            >
              {active ? (
                <motion.span
                  layoutId="preview-device-pill"
                  className="absolute inset-0 -z-10 rounded-md bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              ) : null}
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{preset.label}</span>
            </Button>
          )
        })}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1">
        <div
          className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5"
          role="group"
          aria-label="Preview zoom"
        >
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="h-8 w-8"
            aria-label="Zoom out"
            title="Zoom out"
            disabled={fitWidth || zoom <= MIN_PREVIEW_ZOOM}
            onClick={onZoomOut}
          >
            <ZoomOut className="size-4" />
          </Button>
          <span
            className="min-w-12 text-center text-xs font-medium tabular-nums text-muted-foreground"
            aria-live="polite"
          >
            {fitWidth ? "Fit" : `${zoom}%`}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="h-8 w-8"
            aria-label="Zoom in"
            title="Zoom in"
            disabled={fitWidth || zoom >= MAX_PREVIEW_ZOOM}
            onClick={onZoomIn}
          >
            <ZoomIn className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="h-8 w-8"
            aria-label="Reset zoom to 100%"
            title="Reset zoom"
            disabled={fitWidth || zoom === 100}
            onClick={onResetZoom}
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant={fitWidth ? "default" : "outline"}
          className={cn(
            "h-8",
            fitWidth
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground",
          )}
          aria-pressed={fitWidth}
          title="Fit Width"
          onClick={onFitWidthToggle}
        >
          Fit Width
        </Button>

        <Button
          type="button"
          size="icon-sm"
          variant={fullscreen ? "default" : "outline"}
          className={cn(
            "h-8 w-8",
            fullscreen &&
              "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          aria-pressed={fullscreen}
          aria-label={fullscreen ? "Exit fullscreen preview" : "Fullscreen preview"}
          title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
          onClick={onFullscreenToggle}
        >
          {fullscreen ? (
            <Minimize2 className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </Button>
      </div>

      <p className="basis-full text-[10px] text-muted-foreground sm:basis-auto sm:ml-0">
        Shortcuts: ⌘/Ctrl+S publish · Esc collapse · Delete remove section
      </p>
    </div>
  )
}
