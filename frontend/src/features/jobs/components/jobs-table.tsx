import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  formatJobLabel,
  formatRelativePostedAt,
} from "@/features/jobs/constants"
import type { Job } from "@/features/jobs/types"

type JobsTableProps = {
  jobs: Job[]
  onEdit: (job: Job) => void
  onDelete: (job: Job) => void
}

export function JobsTable({ jobs, onEdit, onDelete }: JobsTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Policy</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Posted</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.location}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatJobLabel(job.work_policy)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatJobLabel(job.experience_level)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatJobLabel(job.employment_type)} ·{" "}
                  {formatJobLabel(job.job_type)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatRelativePostedAt(job.posted_at)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge active={job.is_active} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Edit ${job.title}`}
                      onClick={() => onEdit(job)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Delete ${job.title}`}
                      onClick={() => onDelete(job)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.department} · {job.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatJobLabel(job.work_policy)} ·{" "}
                  {formatJobLabel(job.experience_level)} ·{" "}
                  {formatJobLabel(job.job_type)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativePostedAt(job.posted_at)}
                </p>
                <StatusBadge active={job.is_active} />
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onEdit(job)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onDelete(job)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? "inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
          : "inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
      }
    >
      {active ? "Active" : "Inactive"}
    </span>
  )
}
