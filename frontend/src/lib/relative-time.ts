/** Human-friendly relative timestamps for dashboard and status pills. */
export function formatRelativeTime(
  iso: string | null | undefined,
  now: Date = new Date(),
): string | null {
  if (!iso) {
    return null
  }

  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) {
    return null
  }

  const diffMs = now.getTime() - then.getTime()
  const seconds = Math.max(0, Math.floor(diffMs / 1000))

  if (seconds < 45) {
    return "just now"
  }
  if (seconds < 90) {
    return "1 min ago"
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`
  }

  const days = Math.floor(hours / 24)
  if (days === 1) {
    return "1 day ago"
  }
  if (days < 30) {
    return `${days} days ago`
  }

  return then.toLocaleDateString()
}
