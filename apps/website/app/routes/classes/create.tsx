import { json, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { badRequest, notFound } from 'remix-utils';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { Button, Input } from '@nextui-org/react';
import { AccountType } from ':generated/graphql/orchestrator/generated/graphql';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { CREATE_CLASS } from ':generated/graphql/orchestrator/mutations';
import { getUserDetails } from '~/lib/services/user.server';

export async function loader({ request }: LoaderArgs) {
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher)
    throw notFound({ message: 'Route not found' });
  return json({});
}

export async function action({ request }: ActionArgs) {
  const { name } = await zx.parseForm(request.clone(), {
    name: z.string(),
  });
  const { createClass } = await gqlClient.request(
    CREATE_CLASS,
    { input: { name, teacherIds: [] } },
    authenticatedRequest(request)
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
