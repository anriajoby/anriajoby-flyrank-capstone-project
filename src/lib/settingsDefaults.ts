import type { Settings } from '../types/settings'

export const STORAGE_KEY = 'capstone-settings'

export const defaultSettings: Settings = {
  displayName: '',
  email: '',
  theme: 'system',
  emailNotifications: true,
}

export const THEME_OPTIONS = [
  { value: 'system' as const, label: 'System' },
  { value: 'light' as const, label: 'Light' },
  { value: 'dark' as const, label: 'Dark' },
]
