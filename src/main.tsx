import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyTheme } from './lib/applyTheme'
import { loadSettings } from './lib/settingsStorage'
import './index.css'
import App from './App.tsx'

const { settings } = loadSettings()
applyTheme(settings.theme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
