import { AppShell } from '@mantine/core';
import { Outlet, useLoaderData } from '@remix-run/react';
import { json, LoaderArgs } from '@remix-run/server-runtime';
import { AppNavbar } from '~/lib/components/AppShell';
import { requireValidJwt } from '~/lib/services/auth.server';
import { getUserDetails } from '~/lib/services/user.server';

export const loader = async ({ request }: LoaderArgs) => {
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  return json({ userDetails });
};

export default () => {
  const { userDetails } = useLoaderData<typeof loader>();

  return (
    <AppShell
      navbar={
        <AppNavbar
          email={userDetails.profile.email}
          username={userDetails.profile.username}
          profileAvatarSvg={userDetails.profile.profileAvatar}
        />
      }
      padding={0}
    >
      <Outlet />
    </AppShell>
  );
};
