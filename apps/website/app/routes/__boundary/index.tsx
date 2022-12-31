import { Container, Title } from '@mantine/core';
import { json } from '@remix-run/node';
import { requireValidJwt } from '~/lib/services/auth.server';
import type { LoaderArgs } from '@remix-run/node';

export const loader = async ({ request }: LoaderArgs) => {
  const decoded = await requireValidJwt(request);
  return json({ decoded });
};

export default () => {
  return (
    <Container>
      <Title>Dashboard</Title>
    </Container>
  );
};
