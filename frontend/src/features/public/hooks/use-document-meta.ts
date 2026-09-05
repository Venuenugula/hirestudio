import { useEffect } from "react"

type DocumentMetaOptions = {
  title: string
  description?: string
}

/**
 * Sets document title and meta description for the public careers pages.
 * Restores previous values on unmount.
 */
export function useDocumentMeta({ title, description }: DocumentMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )
    const created = !meta
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "description"
      document.head.appendChild(meta)
    }

    const previousDescription = meta.content
    if (description) {
      meta.content = description
    }

    return () => {
      document.title = previousTitle
      if (meta) {
        if (created) {
          meta.remove()
        } else {
          meta.content = previousDescription
        }
      }
    }
  }, [title, description])
}
