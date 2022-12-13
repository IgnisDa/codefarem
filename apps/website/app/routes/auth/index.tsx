import type { ActionArgs, LinksFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useEffect } from 'react';
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
import styles from './index.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

const authSchema = z.object({
  email: z.string().email(),
  hankoId: z.string(),
});

const urlSchema = z.object({
  inviteToken: z.string().optional(),
});

export const action = async ({ request }: ActionArgs) => {
  const { hankoId, email } = await zx.parseForm(request.clone(), authSchema);
  const { userWithEmail } = await gqlClient.request(USER_WITH_EMAIL, {
    input: { email },
  });
  if (userWithEmail.__typename === 'UserWithEmailError') {
    const { inviteToken } = zx.parseQuery(request.clone(), urlSchema);
    const username = new Date().toISOString();
    await gqlClient.request(REGISTER_USER, {
      input: { email, username, hankoId, inviteToken },
    });
  }
  return redirect(SUCCESSFUL_REDIRECT_PATH);
};

export default () => {
  const fetcher = useFetcher();

  const handler = async () => {
    const hanko = new Hanko(window.ENV.HANKO_URL);
    const user = await hanko.user.getCurrent();
    const data = authSchema.parse({ hankoId: user.id, email: user.email });
    fetcher.submit(data, { method: 'post' });
  };

  useEffect(() => {
    registerHankoAuth({ shadow: true });
    document.addEventListener('hankoAuthSuccess', handler);
    return () => document.removeEventListener('hankoAuthSuccess', handler);
  });

  return (
    <ClientOnly fallback={'Loading...'}>
      {() => <hanko-auth lang="en" api={window.ENV.HANKO_URL} />}
    </ClientOnly>
  );
};
