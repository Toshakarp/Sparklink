import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './shared/styles/globals.scss';
import { initDevEnvironment, initializeTelegram, tgService } from '@/shared/lib';

initDevEnvironment().then(() => {
  initializeTelegram();
  tgService.ready();
  tgService.expand();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
});
