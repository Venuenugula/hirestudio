import { toast } from "sonner"

import { ApiError } from "@/api/client"

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiError) {
    return error.detail
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export function toastError(error: unknown, fallback?: string) {
  toast.error(getErrorMessage(error, fallback))
}

export function toastSuccess(message: string) {
  toast.success(message)
}
