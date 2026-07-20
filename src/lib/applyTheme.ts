import type { ThemePreference } from '../types/settings'

export function applyTheme(theme: ThemePreference): void {
  const root = document.documentElement

  if (theme === 'system') {
    root.removeAttribute('data-theme')
    return
  }

  root.setAttribute('data-theme', theme)
}
