import { ADD_USER_TO_CLASS } from ':graphql/orchestrator/mutations';
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { Form, useFetcher } from '@remix-run/react';
import {
  ActionArgs,
  json,
  LoaderArgs,
  redirect
} from '@remix-run/server-runtime';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { metaFunction } from '~/lib/utils';
import { loader as classDetailsLoader } from '~/routes/api/classDetails';

export const meta = metaFunction;

const title = 'Join a class';

export const loader = async ({ request }: LoaderArgs) => {
  requireValidJwt(request);
  return json({ meta: { title } });
};

const actionSchema = z.object({ classId: z.string() });

export const action = async ({ request }: ActionArgs) => {
  const { classId } = await zx.parseForm(request, actionSchema);
  const { addUserToClass } = await gqlClient.request(
    ADD_USER_TO_CLASS,
    { classId },
    authenticatedRequest(request)
  );
  if (!addUserToClass)
    throw badRequest({ message: 'Could not join class, please try again' });
  return redirect(route('/classes/:id', { id: classId }));
};

export default () => {
  const details = useFetcher<typeof classDetailsLoader>();

  return (
    <Container size={'xs'}>
      <Stack>
        <Title align="center">{title}</Title>
        <Paper withBorder shadow="md" p={25} mt={30} radius="md">
          <details.Form method="get" action={route('/api/classDetails')}>
            <TextInput
              name='joinSlug'
              label="Code"
              placeholder='Enter the class code'
              required
            />
            <Button fullWidth mt="sm" type="submit">
              Join
            </Button>
          </details.Form>
        </Paper>
        {details.data && (
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position={'apart'}>
              <Box>
                <Text>Name: {details.data.classDetails.name}</Text>
                <Text>Teachers: {details.data.classDetails.numTeachers}</Text>
                <Text>Students: {details.data.classDetails.numStudents}</Text>
                <Text>Goals: {details.data.classDetails.numGoals}</Text>
              </Box>
              <Box>
                <Form method="post">
                  <input
                    type="hidden"
                    name="classId"
                    value={details.data.classDetails.id}
                  />
                  <Button type={'submit'}>Join</Button>
                </Form>
              </Box>
            </Group>
          </Card>
        )}
      </Stack>
    </Container>
  );
};
