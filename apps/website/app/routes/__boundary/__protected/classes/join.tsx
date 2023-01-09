import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  TextInput,
  Title
} from '@mantine/core';
import { useFetcher } from '@remix-run/react';
import { ActionArgs, json, LoaderArgs } from '@remix-run/server-runtime';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import { requireValidJwt } from '~/lib/services/auth.server';
import { metaFunction } from '~/lib/utils';
import { loader as classDetailsLoader } from '~/routes/api/classDetails';

export const meta = metaFunction;

const title = 'Join a class';

export const loader = async ({ request }: LoaderArgs) => {
  requireValidJwt(request);
  return json({ meta: { title } });
};

const actionSchema = z.object({
  classId: z.string()
});

export const action = async ({ request }: ActionArgs) => {
  const { classId } = await zx.parseForm(request, actionSchema);
  // classId;
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
          <Alert>{JSON.stringify(details.data.classDetails)}</Alert>
        )}
      </Stack>
    </Container>
  );
};
