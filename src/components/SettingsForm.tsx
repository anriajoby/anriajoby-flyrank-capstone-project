import { useEffect, useId, useState, type FormEvent } from 'react'
import './SettingsForm.css'

export type ThemePreference = 'system' | 'light' | 'dark'

export type Settings = {
  displayName: string
  email: string
  theme: ThemePreference
  emailNotifications: boolean
}

const STORAGE_KEY = 'capstone-settings'

export const defaultSettings: Settings = {
  displayName: '',
  email: '',
  theme: 'system',
  emailNotifications: true,
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw) as Partial<Settings>
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export function applyTheme(theme: ThemePreference) {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  applyTheme(settings.theme)
}

export function SettingsForm() {
  const formId = useId()
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [savedSnapshot, setSavedSnapshot] = useState<Settings>(() =>
    loadSettings(),
  )
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme])

  const isDirty =
    JSON.stringify(settings) !== JSON.stringify(savedSnapshot)

  function updateField<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setStatusMessage(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    saveSettings(settings)
    setSavedSnapshot(settings)
    setStatusMessage('Settings saved.')
  }

  function handleReset() {
    setSettings(savedSnapshot)
    applyTheme(savedSnapshot.theme)
    setStatusMessage(null)
  }

  function handleRestoreDefaults() {
    setSettings(defaultSettings)
    setStatusMessage(null)
  }

  return (
    <form
      id={formId}
      className="settings-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Manage your profile and app preferences for this capstone project.</p>
      </header>

      <fieldset className="settings-form__fieldset">
        <legend>Profile</legend>

        <div className="settings-form__field">
          <label htmlFor={`${formId}-displayName`}>Display name</label>
          <input
            id={`${formId}-displayName`}
            name="displayName"
            type="text"
            autoComplete="name"
            placeholder="Anria Joby"
            value={settings.displayName}
            onChange={(e) => updateField('displayName', e.target.value)}
          />
        </div>

        <div className="settings-form__field">
          <label htmlFor={`${formId}-email`}>Email</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={settings.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="settings-form__fieldset">
        <legend>Preferences</legend>

        <div className="settings-form__field">
          <label htmlFor={`${formId}-theme`}>Theme</label>
          <select
            id={`${formId}-theme`}
            name="theme"
            value={settings.theme}
            onChange={(e) =>
              updateField('theme', e.target.value as ThemePreference)
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="settings-form__field settings-form__field--checkbox">
          <input
            id={`${formId}-notifications`}
            name="emailNotifications"
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) =>
              updateField('emailNotifications', e.target.checked)
            }
          />
          <label htmlFor={`${formId}-notifications`}>
            Email me updates about this project
          </label>
        </div>
      </fieldset>

      <div className="settings-form__actions">
        <button type="submit" className="settings-form__btn settings-form__btn--primary" disabled={!isDirty}>
          Save changes
        </button>
        <button
          type="button"
          className="settings-form__btn"
          onClick={handleReset}
          disabled={!isDirty}
        >
          Discard changes
        </button>
        <button
          type="button"
          className="settings-form__btn settings-form__btn--ghost"
          onClick={handleRestoreDefaults}
        >
          Reset to defaults
        </button>
      </div>

      <p
        className="settings-form__status"
        role="status"
        aria-live="polite"
      >
        {statusMessage ?? (isDirty ? 'You have unsaved changes.' : '\u00a0')}
      </p>
    </form>
  )
}
