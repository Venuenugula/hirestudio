import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useCareersPageQuery } from "@/features/pages/hooks/use-careers-page-query"
import { usePublishCareersPageMutation } from "@/features/pages/hooks/use-publish-careers-page-mutation"
import { useUpdateDraftMutation } from "@/features/pages/hooks/use-update-draft-mutation"
import {
  canDeleteSection,
  createSection,
  duplicateSection,
  normalizePageConfig,
  reorderSections,
  serializePageConfig,
} from "@/features/pages/lib/page-config"
import type {
  AutosaveStatus,
  PageConfig,
  PageSection,
  PageTheme,
  SectionType,
} from "@/features/pages/types"
import { toastError } from "@/lib/toast"

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

  const initializedForCompany = useRef<string | null>(null)
  const lastSavedSnapshot = useRef<string>("")
  const draftRef = useRef<PageConfig | null>(null)
  const saveDraft = updateDraftMutation.mutate
  const saveDraftAsync = updateDraftMutation.mutateAsync

  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  useEffect(() => {
    initializedForCompany.current = null
    setDraft(null)
    setExpandedSectionId(null)
    setAutosaveStatus("idle")
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
  }, [companyId, pageQuery.data])

  useEffect(() => {
    if (!companyId || !draft) {
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
        },
        onError: (error) => {
          setAutosaveStatus("error")
          toastError(error, "Failed to save draft")
        },
      })
    }, AUTOSAVE_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [companyId, draft, saveDraft])

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

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSectionId(sectionId)
  }, [])

  const toggleSectionExpanded = useCallback((sectionId: string) => {
    setExpandedSectionId((current) => (current === sectionId ? null : sectionId))
  }, [])

  const addSection = useCallback((type: SectionType) => {
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
    setExpandedSectionId(section.id)
  }, [])

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

  const duplicateSectionById = useCallback((sectionId: string) => {
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
      const index = current.sections.findIndex((section) => section.id === sectionId)
      if (index < 0) {
        return current
      }
      const sections = [...current.sections]
      sections.splice(index + 1, 0, copy)
      return { ...current, sections }
    })
    setExpandedSectionId(copy.id)
  }, [])

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

  const publish = useCallback(async () => {
    if (!companyId || !draft) {
      return
    }

    const currentSnapshot = snapshot(draft)
    if (currentSnapshot !== lastSavedSnapshot.current) {
      await saveDraftAsync(serializePageConfig(draft))
      lastSavedSnapshot.current = currentSnapshot
      setAutosaveStatus("saved")
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
    autosaveStatus,
    isSaving,
    isPublishing,
    publishedAt: pageQuery.data?.published_at ?? null,
    expandSection,
    toggleSectionExpanded,
    updateTheme,
    addSection,
    removeSection,
    duplicateSection: duplicateSectionById,
    toggleSectionHidden,
    reorderSections: reorderSectionList,
    updateSection,
    publish,
  }
}
