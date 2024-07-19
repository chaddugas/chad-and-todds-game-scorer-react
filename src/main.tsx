import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './main.scss';

// Register the service worker
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
