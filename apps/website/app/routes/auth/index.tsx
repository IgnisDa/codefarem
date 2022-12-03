import type { ActionArgs } from '@remix-run/node';
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
import { AccountType } from ':generated/graphql/orchestrator/generated/graphql';
import { REGISTER_USER } from ':generated/graphql/orchestrator/mutations';

const schema = z.object({ email: z.string().email(), hankoId: z.string() });

export const action = async ({ request }: ActionArgs) => {
  const { hankoId, email } = await zx.parseForm(request.clone(), schema);
  const { userWithEmail } = await gqlClient.request(USER_WITH_EMAIL, {
    input: { email },
  });
  if (userWithEmail.__typename === 'UserWithEmailError') {
    const username = new Date().toISOString();
    const accountType = AccountType.Student;
    await gqlClient.request(REGISTER_USER, {
      input: { email, username, accountType, hankoId },
    });
  }
  return redirect(SUCCESSFUL_REDIRECT_PATH);
};

export default () => {
  const fetcher = useFetcher();

  const handler = async () => {
    const hanko = new Hanko(window.ENV.HANKO_URL);
    const user = await hanko.user.getCurrent();
    const data = schema.parse({ hankoId: user.id, email: user.email });
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
