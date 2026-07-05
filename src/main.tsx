import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initApiInterceptor } from './lib/apiInterceptor';

// Initialize the universal fetch interceptor for local/Vercel seamless operation
initApiInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
