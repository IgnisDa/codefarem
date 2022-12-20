import type { ShouldReloadFunction } from '@remix-run/react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { NotificationsProvider } from '@mantine/notifications';
import { json } from '@remix-run/node';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import type { FC, ReactNode } from 'react';
import { ApplicationConfig } from './lib/config.server';
import {
  AppShell,
  Box,
  createEmotionCache,
  MantineProvider,
} from '@mantine/core';
import { AppNavbar } from './lib/components/AppShell';
import { StylesPlaceholder } from '@mantine/remix';

createEmotionCache({ key: 'mantine' });

// https://remix.run/docs/en/v1/route/should-reload
export const unstable_shouldReload: ShouldReloadFunction = () => {
  return false;
};

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
        <StylesPlaceholder />
        <Meta />
        <Links />
        <script
          defer
          data-domain="codefarem.ignisda.tech"
          src="https://plausible.ignisda.tech/js/script.js"
        />
      </head>
      <body>
        <AppShell navbar={<AppNavbar />} padding={0}>
          <Box h={'100%'} py={40}>
            {children}
          </Box>
          <ScrollRestoration />
          <Scripts />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(ENV)}`,
            }}
          />
          {ENV.NODE_ENV === 'development' && <LiveReload />}
        </AppShell>
      </body>
    </html>
  );
};

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <NotificationsProvider>
        <Document>
          <Outlet />
        </Document>
      </NotificationsProvider>
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
