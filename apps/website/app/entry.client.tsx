import { ClientProvider } from '@mantine/remix';
import { RemixBrowser } from '@remix-run/react';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

const rootElement = (
  <StrictMode>
    <ClientProvider>
      <RemixBrowser />
    </ClientProvider>
  </StrictMode>
);

hydrateRoot(document, rootElement);
