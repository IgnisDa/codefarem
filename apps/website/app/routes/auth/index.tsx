import type { ActionArgs } from '@remix-run/node';
import { useEffect } from 'react';
import { ClientOnly } from 'remix-utils';
import { Hanko } from '@teamhanko/hanko-frontend-sdk';
import { registerHankoAuth } from '~/lib/services/hanko.client';
import { useFetcher } from '@remix-run/react';

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  for (const [key, value] of formData) {
    console.log(key, value);
  }
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
