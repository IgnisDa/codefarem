import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { route } from 'routes-gen';
import { requireValidJwt } from '~/lib/services/auth.server';

import type { LoaderArgs } from '@remix-run/node';

export const loader = async ({ request }: LoaderArgs) => {
  const decoded = await requireValidJwt(request);
  return json({ decoded });
};

export default () => {
  const { decoded } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>CodeFarem</h1>
      <div>{JSON.stringify(decoded)}</div>
      <div>
        <Link to={route('/auth/logout')}>Logout</Link>
      </div>
    </div>
  );
};
