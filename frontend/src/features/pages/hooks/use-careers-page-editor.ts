import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useCareersPageQuery } from "@/features/pages/hooks/use-careers-page-query"
import { usePublishCareersPageMutation } from "@/features/pages/hooks/use-publish-careers-page-mutation"
import { useUpdateDraftMutation } from "@/features/pages/hooks/use-update-draft-mutation"
import {
  applyPageStylePreset,
  canDeleteSection,
  createSection,
  duplicateSection,
  normalizePageConfig,
  reorderSections,
  serializePageConfig,
} from "@/features/pages/lib/page-config"
import type { PageStyleId } from "@/features/pages/lib/design-system"
import type {
  AutosaveStatus,
  PageConfig,
  PageSection,
  PageTheme,
  SectionType,
} from "@/features/pages/types"
import { toastError, toastSuccess } from "@/lib/toast"

const AUTOSAVE_DELAY_MS = 650

function snapshot(config: PageConfig) {
  return JSON.stringify(serializePageConfig(config))
}

export function useCareersPageEditor(companyId: string | null) {
  const pageQuery = useCareersPageQuery(companyId)
  const updateDraftMutation = useUpdateDraftMutation(companyId ?? "", {
    silent: true,
  })
  const publishMutation = usePublishCareersPageMutation(companyId ?? "")

  const [draft, setDraft] = useState<PageConfig | null>(null)
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle")
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [focusSectionId, setFocusSectionId] = useState<string | null>(null)

  const initializedForCompany = useRef<string | null>(null)
  const lastSavedSnapshot = useRef<string>("")
  const draftRef = useRef<PageConfig | null>(null)
  const saveDraft = updateDraftMutation.mutate
  const saveDraftAsync = updateDraftMutation.mutateAsync
  const skipAutosaveOnce = useRef(false)

  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  useEffect(() => {
    initializedForCompany.current = null
    setDraft(null)
    setExpandedSectionId(null)
    setAutosaveStatus("idle")
    setLastSavedAt(null)
    setFocusSectionId(null)
    lastSavedSnapshot.current = ""
  }, [companyId])

  useEffect(() => {
    if (!companyId || !pageQuery.data) {
      return
    }
    if (initializedForCompany.current === companyId) {
      return
    }

    const normalized = normalizePageConfig(pageQuery.data.draft_config)
    setDraft(normalized)
    lastSavedSnapshot.current = snapshot(normalized)
    initializedForCompany.current = companyId
    setExpandedSectionId(normalized.sections[0]?.id ?? null)
    setAutosaveStatus("idle")
    setLastSavedAt(pageQuery.data.updated_at ?? null)
  }, [companyId, pageQuery.data])

  useEffect(() => {
    if (!companyId || !draft) {
      return
    }
    if (skipAutosaveOnce.current) {
      skipAutosaveOnce.current = false
      return
    }

    const nextSnapshot = snapshot(draft)
    if (nextSnapshot === lastSavedSnapshot.current) {
      return
    }

    setAutosaveStatus("dirty")
    const timer = window.setTimeout(() => {
      setAutosaveStatus("saving")
      saveDraft(serializePageConfig(draft), {
        onSuccess: () => {
          lastSavedSnapshot.current = nextSnapshot
          setAutosaveStatus("saved")
          setLastSavedAt(new Date().toISOString())
        },
        onError: (error) => {
          setAutosaveStatus("error")
          toastError(error, "Failed to save draft")
        },
      })
    }, AUTOSAVE_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [companyId, draft, saveDraft])

  const isDirty = useMemo(() => {
    if (!draft) {
      return false
    }
    // Recompute when autosave status changes so ref updates are reflected.
    void autosaveStatus
    return snapshot(draft) !== lastSavedSnapshot.current
  }, [draft, autosaveStatus])

  const updateTheme = useCallback((theme: Partial<PageTheme>) => {
    setDraft((current) => {
      if (!current) {
        return current
      }
      return {
        ...current,
        theme: { ...current.theme, ...theme },
      }
    })
  }, [])

  const applyStylePreset = useCallback((styleId: PageStyleId) => {
    setDraft((current) => {
      if (!current) {
        return current
      }
      return applyPageStylePreset(current, styleId)
    })
  }, [])

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSectionId(sectionId)
  }, [])

  const collapseSection = useCallback(() => {
    setExpandedSectionId(null)
  }, [])

  const toggleSectionExpanded = useCallback((sectionId: string) => {
    setExpandedSectionId((current) => (current === sectionId ? null : sectionId))
  }, [])

  const scrollAndFocusSection = useCallback((sectionId: string) => {
    setExpandedSectionId(sectionId)
    setFocusSectionId(sectionId)
    window.requestAnimationFrame(() => {
      document
        .getElementById(`section-block-${sectionId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [])

  const clearFocusSection = useCallback(() => {
    setFocusSectionId(null)
  }, [])

  const addSection = useCallback(
    (type: SectionType) => {
      const section = createSection(type)
      setDraft((current) => {
        if (!current) {
          return current
        }
        return {
          ...current,
          sections: [...current.sections, section],
        }
      })
      scrollAndFocusSection(section.id)
      return section.id
    },
    [scrollAndFocusSection],
  )

  const removeSection = useCallback((sectionId: string) => {
    const target = draftRef.current?.sections.find(
      (section) => section.id === sectionId,
    )
    if (!target || !canDeleteSection(target)) {
      return
    }

    const remaining =
      draftRef.current?.sections.filter((section) => section.id !== sectionId) ??
      []

    setDraft((current) => {
      if (!current) {
        return current
      }
      return {
        ...current,
        sections: current.sections.filter((section) => section.id !== sectionId),
      }
    })

    setExpandedSectionId((expanded) =>
      expanded === sectionId ? (remaining[0]?.id ?? null) : expanded,
    )
  }, [])

  const duplicateSectionById = useCallback(
    (sectionId: string) => {
      const source = draftRef.current?.sections.find(
        (section) => section.id === sectionId,
      )
      if (!source) {
        return
      }

      const copy = duplicateSection(source)
      setDraft((current) => {
        if (!current) {
          return current
        }
        const index = current.sections.findIndex(
          (section) => section.id === sectionId,
        )
        if (index < 0) {
          return current
        }
        const sections = [...current.sections]
        sections.splice(index + 1, 0, copy)
        return { ...current, sections }
      })
      scrollAndFocusSection(copy.id)
    },
    [scrollAndFocusSection],
  )

  const toggleSectionHidden = useCallback((sectionId: string) => {
    setDraft((current) => {
      if (!current) {
        return current
      }
      return {
        ...current,
        sections: current.sections.map((section) => {
          if (section.id !== sectionId) {
            return section
          }
          const nextHidden = !section.hidden
          if (nextHidden) {
            return { ...section, hidden: true }
          }
          const { hidden: _removed, ...rest } = section
          return rest as PageSection
        }),
      }
    })
  }, [])

  const moveSection = useCallback(
    (sectionId: string, direction: "up" | "down") => {
      setDraft((current) => {
        if (!current) {
          return current
        }
        const index = current.sections.findIndex(
          (section) => section.id === sectionId,
        )
        if (index < 0) {
          return current
        }
        const target = direction === "up" ? index - 1 : index + 1
        if (target < 0 || target >= current.sections.length) {
          return current
        }
        const sections = [...current.sections]
        const [item] = sections.splice(index, 1)
        sections.splice(target, 0, item)
        return { ...current, sections }
      })
    },
    [],
  )

  const reorderSectionList = useCallback((activeId: string, overId: string) => {
    setDraft((current) => {
      if (!current) {
        return current
      }
      return {
        ...current,
        sections: reorderSections(current.sections, activeId, overId),
      }
    })
  }, [])

  const updateSection = useCallback(
    (sectionId: string, patch: Partial<PageSection>) => {
      setDraft((current) => {
        if (!current) {
          return current
        }
        return {
          ...current,
          sections: current.sections.map((section) => {
            if (section.id !== sectionId) {
              return section
            }
            return {
              ...section,
              ...patch,
              type: section.type,
              id: section.id,
            } as PageSection
          }),
        }
      })
    },
    [],
  )

  const saveNow = useCallback(async () => {
    if (!companyId || !draftRef.current) {
      return
    }
    const current = draftRef.current
    const currentSnapshot = snapshot(current)
    if (currentSnapshot === lastSavedSnapshot.current) {
      setAutosaveStatus("saved")
      return
    }

    setAutosaveStatus("saving")
    try {
      skipAutosaveOnce.current = true
      await saveDraftAsync(serializePageConfig(current))
      lastSavedSnapshot.current = currentSnapshot
      setAutosaveStatus("saved")
      setLastSavedAt(new Date().toISOString())
      toastSuccess("Draft saved")
    } catch (error) {
      setAutosaveStatus("error")
      toastError(error, "Failed to save draft")
    }
  }, [companyId, saveDraftAsync])

  const publish = useCallback(async () => {
    if (!companyId || !draft) {
      return
    }

    const currentSnapshot = snapshot(draft)
    if (currentSnapshot !== lastSavedSnapshot.current) {
      await saveDraftAsync(serializePageConfig(draft))
      lastSavedSnapshot.current = currentSnapshot
      setAutosaveStatus("saved")
      setLastSavedAt(new Date().toISOString())
    }

    await publishMutation.mutateAsync()
  }, [companyId, draft, publishMutation, saveDraftAsync])

  const expandedSection = useMemo(() => {
    if (!draft || !expandedSectionId) {
      return null
    }
    return draft.sections.find((section) => section.id === expandedSectionId) ?? null
  }, [draft, expandedSectionId])

  const isSaving =
    updateDraftMutation.isPending || autosaveStatus === "saving"
  const isPublishing = publishMutation.isPending

  return {
    pageQuery,
    draft,
    expandedSectionId,
    expandedSection,
    focusSectionId,
    autosaveStatus,
    isDirty,
    isSaving,
    isPublishing,
    publishedAt: pageQuery.data?.published_at ?? null,
    lastSavedAt,
    expandSection,
    collapseSection,
    toggleSectionExpanded,
    clearFocusSection,
    scrollAndFocusSection,
    updateTheme,
    applyStylePreset,
    addSection,
    removeSection,
    duplicateSection: duplicateSectionById,
    toggleSectionHidden,
    moveSection,
    reorderSections: reorderSectionList,
    updateSection,
    saveNow,
    publish,
  }
}
