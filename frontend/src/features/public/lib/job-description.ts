export type JobDescriptionSection = {
  id: string
  title: string
  body: string
}

const KNOWN_TITLES: Record<string, string> = {
  about: "About the role",
  "about the role": "About the role",
  overview: "About the role",
  responsibilities: "Responsibilities",
  requirements: "Requirements",
  "nice to have": "Nice to have",
  "nice-to-have": "Nice to have",
  preferred: "Nice to have",
  benefits: "Benefits",
  "hiring process": "Hiring process",
  process: "Hiring Process",
  qualifications: "Requirements",
  "what you'll do": "Responsibilities",
  "what you will do": "Responsibilities",
  "what we're looking for": "Requirements",
}

function normalizeTitle(raw: string): string {
  const cleaned = raw.replace(/[:#*_]+/g, "").trim()
  const key = cleaned.toLowerCase()
  return KNOWN_TITLES[key] ?? cleaned
}

function isHeadingLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed || trimmed.length > 80) {
    return false
  }
  if (/^#{1,3}\s+\S/.test(trimmed)) {
    return true
  }
  if (/^\*\*[^*].*\*\*$/.test(trimmed)) {
    return true
  }
  if (/^[A-Z][A-Za-z0-9 /&'()-]{1,60}:$/.test(trimmed)) {
    return true
  }
  if (
    /^[A-Z][A-Z0-9 /&'()-]{2,60}$/.test(trimmed) &&
    !trimmed.includes(".")
  ) {
    return true
  }
  return false
}

function extractHeading(line: string): string {
  return normalizeTitle(
    line
      .trim()
      .replace(/^#{1,3}\s+/, "")
      .replace(/^\*\*(.*)\*\*$/, "$1")
      .replace(/:$/, ""),
  )
}

/** Split free-text JDs into readable Notion-like sections when headings exist. */
export function parseJobDescriptionSections(
  description: string,
): JobDescriptionSection[] {
  const text = description.replace(/\r\n/g, "\n").trim()
  if (!text) {
    return []
  }

  const lines = text.split("\n")
  const sections: JobDescriptionSection[] = []
  let currentTitle = "About the role"
  let buffer: string[] = []

  const flush = () => {
    const body = buffer.join("\n").trim()
    if (!body && sections.length === 0) {
      buffer = []
      return
    }
    if (!body) {
      buffer = []
      return
    }
    sections.push({
      id: `${sections.length}-${currentTitle.toLowerCase().replace(/\s+/g, "-")}`,
      title: currentTitle,
      body,
    })
    buffer = []
  }

  let sawHeading = false
  for (const line of lines) {
    if (isHeadingLine(line)) {
      sawHeading = true
      flush()
      currentTitle = extractHeading(line)
      continue
    }
    buffer.push(line)
  }
  flush()

  if (!sawHeading) {
    return [
      {
        id: "about",
        title: "About the role",
        body: text,
      },
    ]
  }

  return sections
}
