import { json, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { badRequest, notFound } from 'remix-utils';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import { FAILURE_REDIRECT_PATH } from '~/lib/constants';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { Button, Input } from '@nextui-org/react';
import { AccountType } from ':generated/graphql/orchestrator/generated/graphql';
import { getAuthHeader, gqlClient } from '~/lib/services/graphql.server';
import { CREATE_CLASS } from ':generated/graphql/orchestrator/mutations';

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);
  if (user?.userDetails.accountType !== AccountType.Teacher) throw notFound({});
  return json({});
}

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
  const { name } = await zx.parseForm(request.clone(), {
    name: z.string(),
  });
  const { createClass } = await gqlClient.request(
    CREATE_CLASS,
    {
      input: { name, teacherIds: [] },
    },
    getAuthHeader(user.token)
  );
  if (createClass.__typename === 'ApiError')
    throw badRequest({ message: createClass.error });
  throw redirect(route('/classes/:id', { id: createClass.id }));
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
