import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';

const container = document.getElementById('app') as HTMLElement;

const Application = () => (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (import.meta['hot'] || !container?.innerText) {
  const root = createRoot(container);
  root.render(<Application />);
} else {
  hydrateRoot(container, <Application />);
}
