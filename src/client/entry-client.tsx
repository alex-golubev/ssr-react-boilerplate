import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import type { JSX } from 'react'
import { App } from './App'
import './index.css'

const container = document.getElementById('app') as unknown as HTMLElement

const Application = (): JSX.Element => (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

if ((import.meta.hot !== undefined) || ((container?.innerText) === '')) {
  const root = createRoot(container)
  root.render(<Application />)
} else {
  hydrateRoot(container, <Application />)
}
