import { Button, Input } from '@codefarem/react-ui';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';

import { FAILURE_REDIRECT_PATH } from '../../lib/constants';
import { authenticator } from '../../lib/services/auth.server';
import { getFetchOptions, graphqlSdk } from '../../lib/services/graphql.server';

import type { ActionArgs } from '@remix-run/node';

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
  const { name } = await zx.parseForm(request.clone(), {
    name: z.string(),
  });
  const { createClass } = await graphqlSdk.CreateClass(
    { input: { name: name, teacherIds: [] } },
    getFetchOptions(user.token)
  );
  if (createClass.__typename === 'ApiError') throw new Error(createClass.error);
  return redirect(route('/classes/:id', { id: createClass.id }));
}

export default () => {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl">Create Class</h1>
      <Form method="post">
        <Input name="name" type="text" required label="Name" />
        <div className="w-full">
          <Button>Create Class</Button>
        </div>
      </Form>
    </div>
  );
};
