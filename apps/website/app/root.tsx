import { Container, NextUIProvider } from '@nextui-org/react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import type { LinksFunction, MetaFunction } from '@remix-run/node';
import type { FC, ReactNode } from 'react';

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'CodeFarem',
  viewport: 'width=device-width,initial-scale=1',
});

const Document: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Container>{children}</Container>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

export default function App() {
  return (
    <Document>
      <NextUIProvider>
        <Outlet />
      </NextUIProvider>
    </Document>
  );
}
