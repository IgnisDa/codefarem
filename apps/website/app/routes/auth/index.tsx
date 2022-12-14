import type { ActionArgs, LinksFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils';
import { Hanko } from '@teamhanko/hanko-frontend-sdk';
import { registerHankoAuth } from '~/lib/services/hanko.client';
import { useFetcher } from '@remix-run/react';
import { SUCCESSFUL_REDIRECT_PATH } from '~/lib/constants';
import { USER_WITH_EMAIL } from ':generated/graphql/orchestrator/queries';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';
import { REGISTER_USER } from ':generated/graphql/orchestrator/mutations';
import authStyles from '../../styles/auth/index.css';
import { Center, createStyles, Stack, TextInput } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  container: {
    width: '300px',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: '400px',
    },
  },
}));

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: authStyles }];
};

const authSchema = z.object({
  email: z.string().email(),
  hankoId: z.string(),
  inviteToken: z.string().optional(),
});

export const action = async ({ request }: ActionArgs) => {
  const { hankoId, email, inviteToken } = await zx.parseForm(
    request.clone(),
    authSchema
  );
  const { userWithEmail } = await gqlClient.request(USER_WITH_EMAIL, {
    input: { email },
  });
  if (userWithEmail.__typename === 'UserWithEmailError') {
    const username = new Date().toISOString();
    await gqlClient.request(REGISTER_USER, {
      input: { email, username, hankoId, inviteToken: inviteToken || null },
    });
  }
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo');
  if (redirectTo) return redirect(redirectTo);
  return redirect(SUCCESSFUL_REDIRECT_PATH);
};

export default () => {
  const { classes } = useStyles();
  const [inviteToken, setInviteToken] = useState('');
  const fetcher = useFetcher();

  const handler = async () => {
    const hanko = new Hanko(window.ENV.HANKO_URL);
    const user = await hanko.user.getCurrent();
    const data = authSchema.parse({
      hankoId: user.id,
      email: user.email,
      inviteToken: inviteToken,
    });
    fetcher.submit(data, { method: 'post' });
  };

  useEffect(() => {
    registerHankoAuth({ shadow: true });
    document.addEventListener('hankoAuthSuccess', handler);
    return () => document.removeEventListener('hankoAuthSuccess', handler);
  });

  return (
    <Center>
      <Stack className={classes.container}>
        <ClientOnly fallback={'Loading...'}>
          {() => <hanko-auth lang="en" api={window.ENV.HANKO_URL} />}
        </ClientOnly>
        <TextInput
          label="Invite Token"
          value={inviteToken}
          onChange={(event) => setInviteToken(event.currentTarget.value)}
        />
      </Stack>
    </Center>
  );
};
