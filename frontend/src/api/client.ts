export class ApiError extends Error {
  readonly status: number
  readonly detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = "ApiError"
    this.status = status
    this.detail = detail
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

let authToken: string | null = null
let onUnauthorized: (() => void) | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken() {
  return authToken
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

async function parseErrorDetail(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (typeof data === "object" && data !== null && "detail" in data) {
      const detail = (data as { detail: unknown }).detail
      if (typeof detail === "string") {
        return detail
      }
      if (Array.isArray(detail)) {
        const messages = detail
          .map((item) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "msg" in item &&
              typeof (item as { msg: unknown }).msg === "string"
            ) {
              const loc = (item as { loc?: unknown }).loc
              const path = Array.isArray(loc)
                ? loc
                    .filter((part) => typeof part === "string")
                    .join(".")
                : ""
              const msg = (item as { msg: string }).msg
              return path ? `${path}: ${msg}` : msg
            }
            return null
          })
          .filter((message): message is string => Boolean(message))
        if (messages.length > 0) {
          return messages.join("; ")
        }
      }
    }
  } catch {
    // Fall through to status text.
  }
  return response.statusText || "Request failed"
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    if (response.status === 401 && authToken) {
      onUnauthorized?.()
    }
    throw new ApiError(response.status, await parseErrorDetail(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
