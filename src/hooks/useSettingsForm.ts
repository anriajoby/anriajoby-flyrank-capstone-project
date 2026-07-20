import { useCallback, useMemo, useState } from 'react'
import { applyTheme } from '../lib/applyTheme'
import { defaultSettings } from '../lib/settingsDefaults'
import { loadSettings, saveSettings } from '../lib/settingsStorage'
import {
  normalizeSettings,
  validateField,
  validateSettings,
} from '../lib/validateSettings'
import type { FieldErrors, Settings, SettingsField } from '../types/settings'

function settingsEqual(a: Settings, b: Settings): boolean {
  return (
    a.displayName === b.displayName &&
    a.email === b.email &&
    a.theme === b.theme &&
    a.emailNotifications === b.emailNotifications
  )
}

export function useSettingsForm() {
  const initialLoad = useMemo(() => loadSettings(), [])
  const [saved, setSaved] = useState<Settings>(initialLoad.settings)
  const [draft, setDraft] = useState<Settings>(initialLoad.settings)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<SettingsField, boolean>>>(
    {},
  )
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [storageNotice, setStorageNotice] = useState<string | null>(
    initialLoad.usedFallback
      ? 'Saved settings were invalid and have been reset to defaults.'
      : null,
  )

  const isDirty = !settingsEqual(draft, saved)

  const showError = useCallback(
    (field: SettingsField) =>
      Boolean(errors[field] && (touched[field] || submitAttempted)),
    [errors, touched, submitAttempted],
  )

  const updateField = useCallback(
    <K extends SettingsField>(field: K, value: Settings[K]) => {
      setDraft((prev) => {
        const next = { ...prev, [field]: value }
        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors }
          delete nextErrors[field]
          if (field === 'emailNotifications' || field === 'email') {
            delete nextErrors.email
          }
          return nextErrors
        })
        return next
      })
      setStatusMessage(null)
    },
    [],
  )

  const blurField = useCallback((field: SettingsField) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => {
      const next = { ...prev }
      const message = validateField(field, draft)
      if (message) next[field] = message
      else delete next[field]

      if (field === 'emailNotifications' || field === 'email') {
        const emailMessage = validateField('email', draft)
        if (emailMessage) next.email = emailMessage
        else if (field === 'emailNotifications' && !draft.emailNotifications) {
          delete next.email
        }
      }

      return next
    })
  }, [draft])

  const discard = useCallback(() => {
    setDraft(saved)
    setErrors({})
    setTouched({})
    setSubmitAttempted(false)
    setStatusMessage(null)
    applyTheme(saved.theme)
  }, [saved])

  const resetToDefaults = useCallback(() => {
    setDraft({ ...defaultSettings })
    setErrors({})
    setTouched({})
    setSubmitAttempted(false)
    setStatusMessage(null)
    applyTheme(defaultSettings.theme)
  }, [])

  const submit = useCallback(() => {
    setSubmitAttempted(true)
    setTouched({
      displayName: true,
      email: true,
      theme: true,
      emailNotifications: true,
    })

    const result = validateSettings(draft)
    setErrors(result.errors)

    if (!result.valid) {
      setStatusMessage(null)
      const order: SettingsField[] = [
        'displayName',
        'email',
        'theme',
        'emailNotifications',
      ]
      const firstInvalidField = order.find((field) => result.errors[field])
      return { ok: false as const, firstInvalidField }
    }

    const normalized = normalizeSettings(draft)
    saveSettings(normalized)
    setSaved(normalized)
    setDraft(normalized)
    setErrors({})
    applyTheme(normalized.theme)
    setStatusMessage('Settings saved successfully.')
    setStorageNotice(null)
    return { ok: true as const }
  }, [draft])

  return {
    draft,
    saved,
    errors,
    isDirty,
    statusMessage,
    storageNotice,
    showError,
    updateField,
    blurField,
    discard,
    resetToDefaults,
    submit,
  }
}
