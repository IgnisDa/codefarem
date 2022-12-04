import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { route } from 'routes-gen';
import { requireHankoId } from '~/lib/services/auth.server';

import type { LoaderArgs } from '@remix-run/node';

export const loader = async ({ request }: LoaderArgs) => {
  const hankoId = await requireHankoId(request);
  return json({ hankoId });
};

export default () => {
  const { hankoId } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>CodeFarem</h1>
      <div>{hankoId}</div>
      <div>
        <Link to={route('/auth/logout')}>Logout</Link>
      </div>
    </div>
  );
};
