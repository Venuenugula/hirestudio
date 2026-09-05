import { useCallback, useRef, useState, type DragEvent } from "react"
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ImageDropzoneProps = {
  label: string
  hint?: string
  value: string | null
  disabled?: boolean
  uploading?: boolean
  aspectClassName?: string
  onUpload: (file: File) => Promise<void> | void
  onRemove: () => void
}

export function ImageDropzone({
  label,
  hint = "PNG, JPG, WebP up to 2 MB",
  value,
  disabled,
  uploading,
  aspectClassName = "aspect-[4/3]",
  onUpload,
  onRemove,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0]
      if (!file) {
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Choose an image file")
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be 2 MB or smaller")
        return
      }
      setError(null)
      await onUpload(file)
    },
    [onUpload],
  )

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    if (disabled || uploading) {
      return
    }
    await handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        {value ? (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={disabled || uploading}
              onClick={onRemove}
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          </div>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={0}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/20 transition-colors",
          aspectClassName,
          dragging && "border-teal-600 bg-teal-50/50",
          (disabled || uploading) && "pointer-events-none opacity-60",
          value && "border-solid",
        )}
        onClick={() => {
          if (!disabled && !uploading) {
            inputRef.current?.click()
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragging(false)
        }}
        onDrop={onDrop}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
            </span>
            <p className="text-sm font-medium">
              {uploading ? "Uploading…" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        )}
        {value && uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Loader2 className="size-5 animate-spin text-foreground" />
          </div>
        ) : null}
        {!value ? (
          <ImagePlus className="pointer-events-none absolute right-3 bottom-3 size-4 text-muted-foreground/50" />
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(event) => {
          void handleFiles(event.target.files)
          event.target.value = ""
        }}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
