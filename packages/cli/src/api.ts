import { loadSession, type StoredSession } from "./lib/session"

interface ApiResponse<T> {
  data?: T
  error?: string
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const session = loadSession()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  // Include session token if available
  if (session?.token) {
    headers["Authorization"] = `Bearer ${session.token}`
  }

  try {
    const response = await fetch(process.env.API_URL + path, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as { message?: string }
      return { error: errorData.message || `HTTP ${response.status}` }
    }

    const data = (await response.json()) as T
    return { data }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" }
  }
}

// Auth API methods

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  isAnonymous: boolean
}

export interface Session {
  id: string
  token: string
  userId: string
  expiresAt: string
}

// Response from sign-in endpoints (token + user only)
export interface SignInResponse {
  token: string
  user: User
}

// Full session response from /session endpoint
export interface AuthSession {
  user: User
  session: Session
}

export async function signInAnonymous(): Promise<ApiResponse<AuthSession>> {
  // First, sign in to get token and user
  const signInResult = await apiFetch<SignInResponse>("/api/auth/sign-in/anonymous", {
    method: "POST",
  })

  if (signInResult.error || !signInResult.data) {
    return { error: signInResult.error || "Sign-in failed" }
  }

  // Then fetch full session using the token
  const sessionResult = await apiFetch<AuthSession>("/session", {
    headers: {
      Authorization: `Bearer ${signInResult.data.token}`,
    },
  })

  if (sessionResult.error || !sessionResult.data) {
    return { error: sessionResult.error || "Failed to fetch session" }
  }

  return { data: sessionResult.data }
}

export async function sendMagicLink(email: string): Promise<ApiResponse<{ status: boolean }>> {
  return apiFetch<{ status: boolean }>("/api/auth/sign-in/magic-link", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function getSession(): Promise<ApiResponse<AuthSession | null>> {
  return apiFetch<AuthSession | null>("/session")
}

export async function signOut(): Promise<ApiResponse<{ status: boolean }>> {
  return apiFetch<{ status: boolean }>("/api/auth/sign-out", {
    method: "POST",
  })
}

// Helper to convert API session to stored session
export function toStoredSession(authSession: AuthSession): StoredSession {
  return {
    token: authSession.session.token,
    userId: authSession.user.id,
    expiresAt: authSession.session.expiresAt,
  }
}
