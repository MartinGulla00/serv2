import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Router } from './router/Router';
import { Layout } from './Layout';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <Router />
    </Layout>
  </StrictMode>
);
