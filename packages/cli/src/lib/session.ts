import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const CONFIG_DIR = join(homedir(), ".config", "kellemes")
const SESSION_FILE = join(CONFIG_DIR, "session.json")

export interface StoredSession {
  token: string
  userId: string
  expiresAt: string
}

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }
}

export function loadSession(): StoredSession | null {
  try {
    if (!existsSync(SESSION_FILE)) {
      return null
    }
    const data = readFileSync(SESSION_FILE, "utf-8")
    const session = JSON.parse(data) as StoredSession

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      clearSession()
      return null
    }

    return session
  } catch {
    return null
  }
}

export function saveSession(session: StoredSession): void {
  ensureConfigDir()
  writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2))
}

export function clearSession(): void {
  try {
    if (existsSync(SESSION_FILE)) {
      rmSync(SESSION_FILE)
    }
  } catch {
    // Ignore errors when clearing session
  }
}
