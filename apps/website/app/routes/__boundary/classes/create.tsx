import { AccountType } from ':generated/graphql/orchestrator/generated/graphql';
import { CREATE_CLASS } from ':generated/graphql/orchestrator/mutations';
import { Button, Container, Paper, TextInput, Title } from '@mantine/core';
import { json, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import { forbiddenError } from '~/lib/utils';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';

export const loader = async ({ request }: LoaderArgs) => {
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher) forbiddenError();
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
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
};

export default () => {
  return (
    <Container size={'xs'}>
      <Title align="center">Create Class</Title>
      <Paper withBorder shadow="md" p={25} mt={30} radius="md">
        <Form method="post">
          <TextInput label="Name" type={'text'} required name="name" />
          <Button fullWidth mt="sm" type="submit">
            Create
          </Button>
        </Form>
      </Paper>
    </Container>
  );
};
