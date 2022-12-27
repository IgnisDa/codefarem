import { AccountType } from ':generated/graphql/orchestrator/generated/graphql';
import { CREATE_CLASS } from ':generated/graphql/orchestrator/mutations';
import {
  Button,
  Container,
  Divider,
  Flex,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
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
    <Container>
      <Stack>
        <Title>Create Class</Title>
        <Form method="post">
          <TextInput label="Name" type={'text'} required name="name" />
          <Divider variant={'dashed'} my={'md'} />
          <Flex
            justify={{ base: 'center', md: 'end' }}
            gap={'md'}
            wrap={'wrap'}
          >
            <Button variant={'light'} color="green" type={'submit'}>
              Create class
            </Button>
          </Flex>
        </Form>
      </Stack>
    </Container>
  );
};
