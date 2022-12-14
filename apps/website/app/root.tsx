import { Box, createEmotionCache, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { StylesPlaceholder } from '@mantine/remix';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import { ApplicationConfig } from './lib/config.server';
import type { ShouldReloadFunction } from '@remix-run/react';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import type { FC, ReactNode } from 'react';

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
  viewport: 'width=device-width,initial-scale=1'
});

export async function loader() {
  return json({
    ENV: {
      HANKO_URL: ApplicationConfig.HANKO_URL,
      NODE_ENV: process.env.NODE_ENV
    },
    analytics: {
      domains: ApplicationConfig.ANALYTICS_DOMAINS,
      script: ApplicationConfig.ANALYTICS_SCRIPT,
      websiteId: ApplicationConfig.ANALYTICS_WEBSITE_ID
    }
  });
}

const Document: FC<{ children: ReactNode }> = ({ children }) => {
  const { ENV, analytics } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <StylesPlaceholder />
        <Meta />
        <Links />
        <script
          async
          defer
          data-website-id={analytics.websiteId}
          src={analytics.script}
          data-domains={analytics.domains}
        />
      </head>
      <body>
        <Box h={'100%'} py={40} sx={{ minHeight: '100vh' }}>
          {children}
        </Box>
        <ScrollRestoration />
        <Scripts />
        <script
          // rome-ignore lint/security/noDangerouslySetInnerHtml: trusted content
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`
          }}
        />
        {ENV.NODE_ENV === 'development' && <LiveReload />}
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
      NODE_ENV: string;
    };
  }
}
