import type { Settings, ThemePreference } from '../types/settings'
import { defaultSettings, STORAGE_KEY } from './settingsDefaults'

const THEMES: ThemePreference[] = ['system', 'light', 'dark']

function isTheme(value: unknown): value is ThemePreference {
  return typeof value === 'string' && THEMES.includes(value as ThemePreference)
}

function parseStoredSettings(raw: unknown): Settings | null {
  if (typeof raw !== 'object' || raw === null) return null

  const data = raw as Record<string, unknown>

  if (
    typeof data.displayName !== 'string' ||
    typeof data.email !== 'string' ||
    !isTheme(data.theme) ||
    typeof data.emailNotifications !== 'boolean'
  ) {
    return null
  }

  return {
    displayName: data.displayName,
    email: data.email,
    theme: data.theme,
    emailNotifications: data.emailNotifications,
  }
}

export type LoadSettingsResult = {
  settings: Settings
  usedFallback: boolean
}

export function loadSettings(): LoadSettingsResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { settings: { ...defaultSettings }, usedFallback: false }
    }

    const parsed = parseStoredSettings(JSON.parse(raw))
    if (!parsed) {
      return { settings: { ...defaultSettings }, usedFallback: true }
    }

    return { settings: parsed, usedFallback: false }
  } catch {
    return { settings: { ...defaultSettings }, usedFallback: true }
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function clearStoredSettings(): void {
  localStorage.removeItem(STORAGE_KEY)
}
