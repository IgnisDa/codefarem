import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import type { FC, ReactNode } from 'react';
import { ApplicationConfig } from './lib/config.server';
import { createEmotionCache, MantineProvider } from '@mantine/core';

createEmotionCache({ key: 'mantine' });

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'CodeFarem',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader() {
  return json({
    ENV: {
      HANKO_URL: ApplicationConfig.HANKO_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
  });
}

const Document: FC<{ children: ReactNode }> = ({ children }) => {
  const { ENV } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          defer
          data-domain="codefarem.ignisda.tech"
          src="https://plausible.ignisda.tech/js/script.js"
        />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        {ENV.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Document>
        <Outlet />
      </Document>
    </MantineProvider>
  );
}

declare global {
  interface Window {
    ENV: {
      HANKO_URL: string;
    };
  }
}
