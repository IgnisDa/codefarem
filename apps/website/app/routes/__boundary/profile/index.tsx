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
import { Form, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { requireValidJwt } from '~/lib/services/auth.server';
import { getUserDetails } from '~/lib/services/user.server';
import type { LoaderArgs } from '@remix-run/node';

export const loader = async ({ request }: LoaderArgs) => {
  requireValidJwt(request);

  const userDetails = await getUserDetails(request);
  return json({ userDetails });
};

export default () => {
  const { userDetails } = useLoaderData<typeof loader>();
  const [profileSvg, setProfileSvg] = useState(
    userDetails.profile.profileAvatar
  );
  const [isEdited, editedHandler] = useDisclosure(false);

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
              // rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{ __html: profileSvg }}
              onClick={() => {
                editedHandler.open();
              }}
            />
          </Tooltip>
          <Box>
            <Title variant={'gradient'} span order={2}>
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
