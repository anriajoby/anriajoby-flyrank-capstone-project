import type {
  FieldErrors,
  Settings,
  SettingsField,
  ValidationResult,
} from '../types/settings'

const DISPLAY_NAME_MIN = 2
const DISPLAY_NAME_MAX = 50
const EMAIL_MAX = 254
const DISPLAY_NAME_PATTERN = /^[\p{L}\p{M}' -]+$/u

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function trimValue(value: string): string {
  return value.trim()
}

export function validateDisplayName(displayName: string): string | undefined {
  const trimmed = trimValue(displayName)

  if (!trimmed) {
    return 'Display name is required.'
  }

  if (trimmed.length < DISPLAY_NAME_MIN) {
    return `Display name must be at least ${DISPLAY_NAME_MIN} characters.`
  }

  if (trimmed.length > DISPLAY_NAME_MAX) {
    return `Display name must be at most ${DISPLAY_NAME_MAX} characters.`
  }

  if (!DISPLAY_NAME_PATTERN.test(trimmed)) {
    return 'Display name may only contain letters, spaces, hyphens, and apostrophes.'
  }

  return undefined
}

export function validateEmail(email: string): string | undefined {
  const trimmed = trimValue(email)

  if (!trimmed) {
    return 'Email is required.'
  }

  if (trimmed.length > EMAIL_MAX) {
    return `Email must be at most ${EMAIL_MAX} characters.`
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address.'
  }

  return undefined
}

export function validateTheme(theme: Settings['theme']): string | undefined {
  if (theme !== 'system' && theme !== 'light' && theme !== 'dark') {
    return 'Choose a valid theme.'
  }

  return undefined
}

export function validateField(
  field: SettingsField,
  settings: Settings,
): string | undefined {
  switch (field) {
    case 'displayName':
      return validateDisplayName(settings.displayName)
    case 'email':
      return validateEmail(settings.email)
    case 'theme':
      return validateTheme(settings.theme)
    case 'emailNotifications':
      if (settings.emailNotifications) {
        return validateEmail(settings.email)
      }
      return undefined
    default:
      return undefined
  }
}

export function validateSettings(settings: Settings): ValidationResult {
  const errors: FieldErrors = {}

  const displayNameError = validateDisplayName(settings.displayName)
  if (displayNameError) errors.displayName = displayNameError

  const emailError = validateEmail(settings.email)
  if (emailError) errors.email = emailError

  const themeError = validateTheme(settings.theme)
  if (themeError) errors.theme = themeError

  if (settings.emailNotifications && emailError) {
    errors.email = emailError
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function normalizeSettings(settings: Settings): Settings {
  return {
    ...settings,
    displayName: trimValue(settings.displayName),
    email: trimValue(settings.email),
  }
}
