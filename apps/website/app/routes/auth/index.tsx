import type { ActionArgs } from '@remix-run/node';
import { useEffect } from 'react';
import { ClientOnly } from 'remix-utils';
import { Hanko } from '@teamhanko/hanko-frontend-sdk';
import { registerHankoAuth } from '~/lib/services/hanko.client';
import { useFetcher } from '@remix-run/react';
import {
  SUCCESSFUL_REDIRECT_PATH,
  FAILURE_REDIRECT_PATH,
  FORM_EMAIL_KEY,
} from '~/lib/constants';
import { authenticator } from '~/lib/services/auth.server';
import { USER_WITH_EMAIL } from ':generated/graphql/orchestrator/queries';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';
import { AccountType } from ':generated/graphql/orchestrator/generated/graphql';
import { REGISTER_USER } from ':generated/graphql/orchestrator/mutations';

export const action = async ({ request }: ActionArgs) => {
  const { email } = await zx.parseForm(request.clone(), {
    [FORM_EMAIL_KEY]: z.string().email(),
  });
  const { userWithEmail } = await gqlClient.request(USER_WITH_EMAIL, {
    input: { email },
  });
  if (userWithEmail.__typename === 'UserWithEmailError') {
    const username = new Date().toISOString();
    const accountType = AccountType.Student;
    await gqlClient.request(REGISTER_USER, {
      input: { email, username, accountType },
    });
  }
  return await authenticator.authenticate('form', request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
};

export default () => {
  const fetcher = useFetcher();

  const handler = async () => {
    const hanko = new Hanko(window.ENV.HANKO_URL);
    const user = await hanko.user.getCurrent();
    const data = { id: user.id, email: user.email };
    fetcher.submit(data, { method: 'post' });
  };

  useEffect(() => {
    registerHankoAuth({ shadow: true });
    document.addEventListener('hankoAuthSuccess', handler);
    return () => document.removeEventListener('hankoAuthSuccess', handler);
  });

  return (
    <div>
      <div>Authenticate</div>
      <ClientOnly fallback={'loading'}>
        {() => <hanko-auth lang="en" api={window.ENV.HANKO_URL} />}
      </ClientOnly>
    </div>
  );
};
