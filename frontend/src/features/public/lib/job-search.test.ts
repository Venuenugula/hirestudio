import { describe, expect, it } from "vitest"

import type { Job } from "@/features/jobs/types"
import {
  EMPTY_PUBLIC_JOB_FILTERS,
  parseNaturalLanguageQuery,
  parseSalaryScore,
  renderHighlightSegments,
  searchPublicJobs,
} from "@/features/public/lib/job-search"

function makeJob(overrides: Partial<Job> & Pick<Job, "id" | "title">): Job {
  return {
    company_id: "c1",
    department: "Engineering",
    location: "Hyderabad",
    experience_level: "mid_level",
    employment_type: "full_time",
    work_policy: "hybrid",
    job_type: "permanent",
    salary_range: "18–28 LPA",
    description: "Build APIs with Python and FastAPI.",
    is_active: true,
    application_url: null,
    posted_at: "2026-01-10T00:00:00Z",
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
    ...overrides,
  }
}

const jobs: Job[] = [
  makeJob({
    id: "1",
    title: "Backend Engineer",
    description: "Python FastAPI PostgreSQL APIs",
    work_policy: "remote",
    salary_range: "25–35 LPA",
    posted_at: "2026-03-01T00:00:00Z",
  }),
  makeJob({
    id: "2",
    title: "Frontend Engineer",
    location: "Bengaluru",
    description: "React TypeScript JavaScript UI",
    work_policy: "hybrid",
    salary_range: "20–30 LPA",
    posted_at: "2026-02-01T00:00:00Z",
  }),
  makeJob({
    id: "3",
    title: "AI Research Intern",
    experience_level: "junior",
    job_type: "internship",
    description: "Machine learning and LLM research",
    work_policy: "remote",
    salary_range: "6–8 LPA",
    posted_at: "2026-01-01T00:00:00Z",
  }),
]

describe("parseNaturalLanguageQuery", () => {
  it("extracts remote + location + remaining skill terms", () => {
    const parsed = parseNaturalLanguageQuery("remote python in Hyderabad", [
      "Hyderabad",
      "Bengaluru",
    ])
    expect(parsed.work_policy).toBe("remote")
    expect(parsed.location).toBe("Hyderabad")
    expect(parsed.remainingQuery).toContain("python")
  })

  it("extracts internship / intern aliases", () => {
    const parsed = parseNaturalLanguageQuery("intern ai")
    expect(parsed.job_type).toBe("internship")
    expect(parsed.remainingQuery).toContain("ai")
  })
})

describe("searchPublicJobs", () => {
  it("matches title terms", () => {
    const results = searchPublicJobs(jobs, {
      ...EMPTY_PUBLIC_JOB_FILTERS,
      query: "backend",
    })
    expect(results.map((job) => job.id)).toEqual(["1"])
  })

  it("matches description skills", () => {
    const results = searchPublicJobs(jobs, {
      ...EMPTY_PUBLIC_JOB_FILTERS,
      query: "python",
    })
    expect(results.some((job) => job.id === "1")).toBe(true)
  })

  it("fuzzy-matches common typos", () => {
    const results = searchPublicJobs(jobs, {
      ...EMPTY_PUBLIC_JOB_FILTERS,
      query: "javascipt",
    })
    expect(results.some((job) => job.id === "2")).toBe(true)
  })

  it("applies NL remote + skill filters together", () => {
    const results = searchPublicJobs(jobs, {
      ...EMPTY_PUBLIC_JOB_FILTERS,
      query: "remote frontend",
    })
    expect(results.every((job) => job.work_policy === "remote")).toBe(true)
  })

  it("finds AI internships via NL", () => {
    const results = searchPublicJobs(jobs, {
      ...EMPTY_PUBLIC_JOB_FILTERS,
      query: "intern ai",
    })
    expect(results.map((job) => job.id)).toEqual(["3"])
  })

  it("sorts by highest salary", () => {
    const results = searchPublicJobs(jobs, {
      ...EMPTY_PUBLIC_JOB_FILTERS,
      sort: "salary_desc",
    })
    expect(results[0]?.id).toBe("1")
  })
})

describe("helpers", () => {
  it("parses salary scores", () => {
    expect(parseSalaryScore("18–28 LPA")).toBe(28)
  })

  it("highlights matched terms", () => {
    const segments = renderHighlightSegments("Python FastAPI", "python")
    expect(segments.some((segment) => segment.hit && /python/i.test(segment.text))).toBe(
      true,
    )
  })
})
