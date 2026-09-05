import { useEffect } from "react"
import { useBlocker } from "react-router-dom"

type UseUnsavedChangesGuardOptions = {
  when: boolean
  message?: string
}

/** Warn on browser unload and block in-app navigations when edits are dirty. */
export function useUnsavedChangesGuard({
  when,
  message = "You have unsaved changes. Leave this page?",
}: UseUnsavedChangesGuardOptions) {
  useEffect(() => {
    if (!when) {
      return
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = message
      return message
    }

    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [when, message])

  const blocker = useBlocker(when)

  useEffect(() => {
    if (blocker.state !== "blocked") {
      return
    }
    const confirmed = window.confirm(message)
    if (confirmed) {
      blocker.proceed()
    } else {
      blocker.reset()
    }
  }, [blocker, message])
}
