import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { motion } from "framer-motion"

import { useJobsQuery } from "@/features/jobs/hooks/use-jobs-query"
import { PreviewToolbar } from "@/features/pages/components/preview-toolbar"
import {
  clampPreviewZoom,
  DEFAULT_PREVIEW_DEVICE,
  DEFAULT_PREVIEW_ZOOM,
  getPreviewDevice,
  PREVIEW_ZOOM_STEP,
  type PreviewDevice,
} from "@/features/pages/lib/preview-devices"
import type { PageConfig } from "@/features/pages/types"
import {
  CareersPageRenderer,
  type CareersPageCompany,
} from "@/features/public/components/careers-page-renderer"
import { cn } from "@/lib/utils"

type LivePreviewProps = {
  draft: PageConfig
  companyId: string
  company: CareersPageCompany
  slug: string
}

const PREVIEW_SPRING = { type: "spring" as const, stiffness: 280, damping: 28 }

/**
 * Device chrome + scaling only. Page content is CareersPageRenderer (same as public).
 */
export function LivePreview({
  draft,
  companyId,
  company,
  slug,
}: LivePreviewProps) {
  const jobsQuery = useJobsQuery(companyId, { is_active: true })
  const activeJobs = jobsQuery.data?.items ?? []

  const [device, setDevice] = useState<PreviewDevice>(DEFAULT_PREVIEW_DEVICE)
  const [zoom, setZoom] = useState(DEFAULT_PREVIEW_ZOOM)
  const [fitWidth, setFitWidth] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  const viewportRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const preset = getPreviewDevice(device)

  useLayoutEffect(() => {
    const node = viewportRef.current
    if (!node) {
      return
    }

    const update = () => setContainerWidth(node.clientWidth)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [fullscreen])

  useLayoutEffect(() => {
    const node = frameRef.current
    if (!node) {
      return
    }

    const update = () => setContentHeight(node.scrollHeight)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [draft, device, activeJobs.length, company.name, company.logo_url])

  useEffect(() => {
    if (!fullscreen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [fullscreen])

  const scale = fitWidth
    ? containerWidth > 0
      ? Math.min(1, (containerWidth - 32) / preset.width)
      : 1
    : zoom / 100

  const frameHeight = Math.max(contentHeight, preset.minHeight)

  const handleDeviceChange = useCallback((next: PreviewDevice) => {
    setDevice(next)
  }, [])

  const handleZoomIn = useCallback(() => {
    setFitWidth(false)
    setZoom((current) => clampPreviewZoom(current + PREVIEW_ZOOM_STEP))
  }, [])

  const handleZoomOut = useCallback(() => {
    setFitWidth(false)
    setZoom((current) => clampPreviewZoom(current - PREVIEW_ZOOM_STEP))
  }, [])

  const handleResetZoom = useCallback(() => {
    setFitWidth(false)
    setZoom(DEFAULT_PREVIEW_ZOOM)
  }, [])

  const handleFitWidthToggle = useCallback(() => {
    setFitWidth((current) => {
      if (current) {
        setZoom(DEFAULT_PREVIEW_ZOOM)
        return false
      }
      return true
    })
  }, [])

  const shell = (
    <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
          fullscreen && "h-full rounded-none border-0 shadow-none",
        )}
      >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">Live preview</h2>
          <p className="truncate text-xs text-muted-foreground">
            Exact public renderer · draft · hidden blocks excluded
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <p className="hidden text-xs text-muted-foreground sm:block">
            {preset.width}px · {Math.round(scale * 100)}%
          </p>
          <button
            type="button"
            className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            onClick={() => setFullscreen((current) => !current)}
          >
            {fullscreen ? "Exit full screen" : "Full screen"}
          </button>
        </div>
      </div>

      <PreviewToolbar
        device={device}
        zoom={zoom}
        fitWidth={fitWidth}
        fullscreen={fullscreen}
        onDeviceChange={handleDeviceChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitWidthToggle={handleFitWidthToggle}
        onFullscreenToggle={() => setFullscreen((current) => !current)}
      />

      <div
        ref={viewportRef}
        className={cn(
          "relative flex-1 overflow-auto bg-[linear-gradient(45deg,color-mix(in_oklab,var(--muted)_65%,transparent)_25%,transparent_25%,transparent_75%,color-mix(in_oklab,var(--muted)_65%,transparent)_75%),linear-gradient(45deg,color-mix(in_oklab,var(--muted)_65%,transparent)_25%,transparent_25%,transparent_75%,color-mix(in_oklab,var(--muted)_65%,transparent)_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]",
          fullscreen ? "min-h-0" : "max-h-[min(70vh,52rem)] min-h-[28rem]",
        )}
      >
        <div className="flex justify-center p-6 md:p-8">
          <motion.div
            className="relative"
            animate={{
              width: preset.width * scale,
              height: frameHeight * scale,
            }}
            transition={PREVIEW_SPRING}
          >
            <motion.div
              ref={frameRef}
              className="absolute top-0 left-0 overflow-hidden rounded-lg border border-border bg-background shadow-lg"
              animate={{
                width: preset.width,
                minHeight: preset.minHeight,
                scale,
              }}
              style={{ transformOrigin: "top left" }}
              transition={PREVIEW_SPRING}
            >
              <div
                className="flex h-8 items-center gap-1.5 border-b border-border bg-muted/50 px-3"
                aria-hidden
              >
                <span className="size-1.5 rounded-full bg-foreground/20" />
                <span className="size-1.5 rounded-full bg-foreground/20" />
                <span className="size-1.5 rounded-full bg-foreground/20" />
                <span className="ml-2 truncate text-[10px] text-muted-foreground">
                  /careers/{slug} · {preset.label}
                </span>
              </div>
              <CareersPageRenderer
                config={draft}
                company={company}
                jobs={activeJobs}
                slug={slug}
                disableNavigation
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        {shell}
      </div>
    )
  }

  return shell
}
