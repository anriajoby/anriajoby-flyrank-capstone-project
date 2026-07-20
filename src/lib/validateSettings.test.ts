import { describe, expect, it } from 'vitest'
import type { Settings } from '../types/settings'
import {
  normalizeSettings,
  validateDisplayName,
  validateEmail,
  validateField,
  validateSettings,
  validateTheme,
} from './validateSettings'

const validSettings: Settings = {
  displayName: 'Anria Joby',
  email: 'anria@example.com',
  theme: 'system',
  emailNotifications: true,
}

describe('validateDisplayName', () => {
  it('requires a non-empty trimmed value', () => {
    expect(validateDisplayName('')).toBe('Display name is required.')
    expect(validateDisplayName('   ')).toBe('Display name is required.')
  })

  it('enforces length bounds', () => {
    expect(validateDisplayName('A')).toMatch(/at least 2/)
    expect(validateDisplayName('A'.repeat(51))).toMatch(/at most 50/)
  })

  it('rejects invalid characters', () => {
    expect(validateDisplayName('User123')).toMatch(/letters/)
  })

  it('accepts valid names', () => {
    expect(validateDisplayName("Anria O'Brien")).toBeUndefined()
    expect(validateDisplayName('Jean-Luc')).toBeUndefined()
  })
})

describe('validateEmail', () => {
  it('requires email', () => {
    expect(validateEmail('')).toBe('Email is required.')
  })

  it('rejects invalid formats', () => {
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address.')
    expect(validateEmail('a@b')).toBe('Enter a valid email address.')
  })

  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBeUndefined()
  })
})

describe('validateTheme', () => {
  it('accepts known themes', () => {
    expect(validateTheme('light')).toBeUndefined()
  })

  it('rejects unknown theme', () => {
    expect(validateTheme('neon' as Settings['theme'])).toBe('Choose a valid theme.')
  })
})

describe('validateField', () => {
  it('validates email when notifications are enabled', () => {
    const settings: Settings = {
      ...validSettings,
      email: '',
      emailNotifications: true,
    }
    expect(validateField('emailNotifications', settings)).toBe('Email is required.')
  })
})

describe('validateSettings', () => {
  it('returns valid for complete settings', () => {
    const result = validateSettings(validSettings)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('collects multiple field errors', () => {
    const result = validateSettings({
      ...validSettings,
      displayName: '',
      email: 'bad',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.displayName).toBeDefined()
    expect(result.errors.email).toBeDefined()
  })
})

describe('normalizeSettings', () => {
  it('trims display name and email', () => {
    expect(
      normalizeSettings({
        ...validSettings,
        displayName: '  Anria Joby  ',
        email: '  anria@example.com  ',
      }),
    ).toEqual(validSettings)
  })
})
