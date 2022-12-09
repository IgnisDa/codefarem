import { MantineProvider } from '@mantine/core';
import {
  createReactRouter,
  createRouteConfig,
  Link,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { OrganizationsPage } from './pages/organizations';

const rootRoute = createRouteConfig({
  component: () => (
    <>
      <Link to="/organizations">Organizations</Link>
      <hr />
      <Outlet />
    </>
  ),
});

const organizationsRoute = rootRoute.createRoute({
  component: OrganizationsPage,
  path: '/organizations',
});

const routeConfig = rootRoute.addChildren([organizationsRoute]);

const router = createReactRouter({ routeConfig });

// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
