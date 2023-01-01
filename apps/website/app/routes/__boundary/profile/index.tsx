import { UPDATE_USER } from ':graphql/orchestrator/mutations';
import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ActionArgs, json } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import { metaFunction } from '~/lib/utils';
import type { loader as randomProfileAvatarLoader } from '~/routes/api/randomProfileAvatar';
import type { LoaderArgs } from '@remix-run/node';

export const meta = metaFunction;

export const loader = async ({ request }: LoaderArgs) => {
  requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  return json({ userDetails, meta: { title: 'Profile' } });
};

const updateUserSchema = z.object({
  profileAvatar: z.string().optional(),
  username: z.string().optional()
});

export const action = async ({ request }: ActionArgs) => {
  const { profileAvatar, username } = await zx.parseForm(
    request,
    updateUserSchema
  );
  const { updateUser } = await gqlClient.request(
    UPDATE_USER,
    { input: { profileAvatar, username } },
    authenticatedRequest(request)
  );
  if (updateUser.__typename === 'ApiError')
    throw badRequest({ message: updateUser.error });
  // TODO: Set flash message here
  return json({});
};

export default () => {
  const { userDetails } = useLoaderData<typeof loader>();
  const [profileSvg, setProfileSvg] = useState(
    userDetails.profile.profileAvatar
  );
  const [isEdited, editedHandler] = useDisclosure(false);
  const fetcher = useFetcher<typeof randomProfileAvatarLoader>();

  useEffect(() => {
    if (fetcher.data) {
      setProfileSvg(fetcher.data.randomProfileAvatar);
      editedHandler.open();
    }
  }, [fetcher.data]);

  return (
    <Container>
      <Stack>
        <Title>Your profile</Title>
        <Group>
          <Tooltip label={'Regenerate profile picture'} position={'left'}>
            <Box
              h={'120px'}
              w={'120px'}
              sx={{ cursor: 'pointer' }}
              // rome-ignore lint/security/noDangerouslySetInnerHtml: generated on the server using a secure library
              dangerouslySetInnerHTML={{ __html: profileSvg }}
              onClick={() => fetcher.load(route('/api/randomProfileAvatar'))}
            />
          </Tooltip>
          <Box>
            <Title
              variant={'gradient'}
              gradient={{ from: '#FF512F', to: '#DD2476' }}
              span
              order={2}
            >
              @{userDetails.profile.username}
            </Title>
            <Text color={'dimmed'}>{userDetails.profile.email}</Text>
          </Box>
        </Group>
        {isEdited && (
          <Form method={'post'}>
            <input type="hidden" name="profileAvatar" value={profileSvg} />
            <Button variant={'light'} color={'green'} type={'submit'}>
              Update profile
            </Button>
          </Form>
        )}
      </Stack>
    </Container>
  );
};
