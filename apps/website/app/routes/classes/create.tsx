import { AccountType } from '@codefarem/generated/orchestrator-graphql';
import { json, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { notFound } from 'remix-utils';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import { FAILURE_REDIRECT_PATH } from '~/lib/constants';
import { authenticator } from '~/lib/services/auth.server';
import { graphqlScalars, graphqlSdk } from '~/lib/services/graphql.server';

import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { Button, Input } from '@nextui-org/react';

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);
  if (user?.userDetails.accountType !== AccountType.TEACHER) throw notFound({});
  return json({});
}

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
  const { name } = await zx.parseForm(request.clone(), {
    name: z.string(),
  });
  const { createClass } = await graphqlSdk(user.token)('mutation', {
    scalars: graphqlScalars,
  })({
    createClass: [
      { input: { name, teacherIds: [] } },
      {
        __typename: true,
        '...on ApiError': { error: true },
        '...on CreateClassOutput': { id: true },
      },
    ],
  });
  if (createClass.__typename === 'ApiError') throw new Error(createClass.error);
  return redirect(route('/classes/:id', { id: createClass.id }));
}

export default () => {
  return (
    <div>
      <h1>Create Class</h1>
      <Form method="post">
        <Input name="name" type="text" required label="Name" />
        <div>
          <Button type="submit">Create Class</Button>
        </div>
      </Form>
    </div>
  );
};
