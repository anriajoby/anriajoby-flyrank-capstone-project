export type ThemePreference = 'system' | 'light' | 'dark'

export type Settings = {
  displayName: string
  email: string
  theme: ThemePreference
  emailNotifications: boolean
}

export type SettingsField = keyof Settings

export type FieldErrors = Partial<Record<SettingsField, string>>

export type ValidationResult = {
  valid: boolean
  errors: FieldErrors
}
