import { useRef, type FormEvent } from 'react'
import { useSettingsForm } from '../hooks/useSettingsForm'
import { THEME_OPTIONS } from '../lib/settingsDefaults'
import { FormField } from './FormField'
import './SettingsForm.css'

export function SettingsForm() {
  const {
    draft,
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
  } = useSettingsForm()

  const displayNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const themeRef = useRef<HTMLSelectElement>(null)

  const fieldRefs = {
    displayName: displayNameRef,
    email: emailRef,
    theme: themeRef,
  } as const

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = submit()
    if (!result.ok && result.firstInvalidField) {
      const ref = fieldRefs[result.firstInvalidField as keyof typeof fieldRefs]
      ref?.current?.focus()
    }
  }

  const displayNameShowsError = showError('displayName')
  const emailShowsError = showError('email')
  const themeShowsError = showError('theme')

  const hasVisibleErrors =
    (displayNameShowsError && errors.displayName) ||
    (emailShowsError && errors.email) ||
    (themeShowsError && errors.theme)

  return (
    <div className="settings-page">
      <header className="settings-page__header">
        <h1>Settings</h1>
        <p className="settings-page__lead">
          Update your profile and preferences. Changes are stored in this browser only.
        </p>
      </header>

      {storageNotice ? (
        <p className="settings-form__notice" role="status">
          {storageNotice}
        </p>
      ) : null}

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        {hasVisibleErrors ? (
          <div className="settings-form__summary" role="alert">
            <p>Fix the highlighted fields before saving.</p>
          </div>
        ) : null}

        <fieldset className="settings-form__section">
          <legend>Profile</legend>

          <FormField
            label="Display name"
            error={errors.displayName}
            showError={displayNameShowsError}
          >
            {({ inputId, errorId }) => (
              <input
                ref={displayNameRef}
                id={inputId}
                className="settings-form__input"
                type="text"
                name="displayName"
                autoComplete="name"
                minLength={2}
                maxLength={50}
                value={draft.displayName}
                onChange={(event) => updateField('displayName', event.target.value)}
                onBlur={() => blurField('displayName')}
                aria-invalid={displayNameShowsError && Boolean(errors.displayName)}
                aria-describedby={
                  displayNameShowsError && errors.displayName ? errorId : undefined
                }
              />
            )}
          </FormField>

          <FormField
            label="Email"
            error={errors.email}
            showError={emailShowsError}
          >
            {({ inputId, errorId }) => (
              <input
                ref={emailRef}
                id={inputId}
                className="settings-form__input"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                value={draft.email}
                onChange={(event) => updateField('email', event.target.value)}
                onBlur={() => blurField('email')}
                aria-invalid={emailShowsError && Boolean(errors.email)}
                aria-describedby={
                  emailShowsError && errors.email ? errorId : undefined
                }
              />
            )}
          </FormField>
        </fieldset>

        <fieldset className="settings-form__section">
          <legend>Preferences</legend>

          <FormField
            label="Theme"
            error={errors.theme}
            showError={themeShowsError}
          >
            {({ inputId, errorId }) => (
              <select
                ref={themeRef}
                id={inputId}
                className="settings-form__input"
                name="theme"
                value={draft.theme}
                onChange={(event) =>
                  updateField('theme', event.target.value as typeof draft.theme)
                }
                onBlur={() => blurField('theme')}
                aria-invalid={themeShowsError && Boolean(errors.theme)}
                aria-describedby={
                  themeShowsError && errors.theme ? errorId : undefined
                }
              >
                {THEME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          <div className="form-field form-field--checkbox">
            <label className="settings-form__checkbox-label">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={draft.emailNotifications}
                onChange={(event) =>
                  updateField('emailNotifications', event.target.checked)
                }
                onBlur={() => blurField('emailNotifications')}
              />
              Email notifications
            </label>
            {emailShowsError && errors.email ? (
              <p className="form-field__hint">
                A valid email is required when notifications are enabled.
              </p>
            ) : null}
          </div>
        </fieldset>

        <div className="settings-form__actions">
          <button type="submit" className="settings-form__button settings-form__button--primary">
            Save changes
          </button>
          <button
            type="button"
            className="settings-form__button"
            onClick={discard}
            disabled={!isDirty}
          >
            Discard changes
          </button>
          <button
            type="button"
            className="settings-form__button settings-form__button--ghost"
            onClick={resetToDefaults}
          >
            Reset to defaults
          </button>
        </div>

        {isDirty ? (
          <p className="settings-form__hint" role="status">
            You have unsaved changes.
          </p>
        ) : null}

        {statusMessage ? (
          <p className="settings-form__success" role="status">
            {statusMessage}
          </p>
        ) : null}
      </form>
    </div>
  )
}
