import { ClientProvider } from '@mantine/remix';
import { RemixBrowser } from '@remix-run/react';
import { StrictMode } from 'react';
import { hydrate } from 'react-dom';

const rootElement = (
  <StrictMode>
    <ClientProvider>
      <RemixBrowser />
    </ClientProvider>
  </StrictMode>
);

hydrate(rootElement, document);
