import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './lib/i18n';
import './index.css';
import App from './App';

// Bloquer le pinch-to-zoom sur iOS Safari (user-scalable=no est ignoré par Apple)
// On intercepte les événements multi-touch et on annule le zoom natif
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  // Bloquer aussi le double-tap zoom
  if (now - lastTouchEnd < 300) e.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

document.addEventListener('gesturestart', (e) => {
  e.preventDefault();
}, { passive: false });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
