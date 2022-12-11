import { AppShell, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createReactRouter,
  createRouteConfig,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { NavbarMinimal } from './components/Navbar';
import { InvitePage } from './pages/invite';

const queryClient = new QueryClient();

const rootRoute = createRouteConfig({
  component: () => (
    <AppShell navbar={<NavbarMinimal />}>
      <Outlet />
    </AppShell>
  ),
});

const inviteRoute = rootRoute.createRoute({
  component: InvitePage,
  path: '/invite',
});

const routeConfig = rootRoute.addChildren([inviteRoute]);

const router = createReactRouter({ routeConfig });

// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  );
}
