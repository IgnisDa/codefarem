import { Container, Title } from '@mantine/core';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireValidJwt } from '~/lib/services/auth.server';
import { getUserDetails } from '~/lib/services/user.server';
import type { LoaderArgs } from '@remix-run/node';

export const loader = async ({ request }: LoaderArgs) => {
  requireValidJwt(request);

  const userDetails = await getUserDetails(request);
  return json({ userDetails });
};

export default () => {
  const { userDetails } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Title>Profile</Title>
      <div
        dangerouslySetInnerHTML={{ __html: userDetails.profile.profileAvatar }}
      />
    </Container>
  );
};
