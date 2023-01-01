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
import { json } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { route } from 'routes-gen';
import { requireValidJwt } from '~/lib/services/auth.server';
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
            <Button variant={'light'} color={'green'}>
              Update profile
            </Button>
          </Form>
        )}
      </Stack>
    </Container>
  );
};
