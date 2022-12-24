import { TOOLCHAIN_INFORMATION } from ':generated/graphql/orchestrator/queries';
import {
  Avatar,
  Code,
  Container,
  Flex,
  Grid,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { gqlClient } from '~/lib/services/graphql.server';
import type { LoaderArgs } from '@remix-run/server-runtime';

export const loader = async (_args: LoaderArgs) => {
  const { toolchainInformation } = await gqlClient.request(
    TOOLCHAIN_INFORMATION
  );
  return json({ toolchainInformation });
};

interface ToolchainDisplayProps {
  avatar: string;
  name: string;
  email: string;
}

export function ToolchainDisplay({
  avatar,
  name,
  email,
}: ToolchainDisplayProps) {
  return (
    <Tooltip label={name}>
      <Flex align={'center'} gap={20}>
        <Avatar src={avatar} size={94} radius="md" />
        <Stack>
          <Code>{email}</Code>
        </Stack>
      </Flex>
    </Tooltip>
  );
}

export default () => {
  const { toolchainInformation } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Stack>
        <Title>Toolchain Information</Title>
        <Grid gutter={25}>
          {toolchainInformation.map((toolchain, idx) => (
            <Grid.Col key={idx} sm={12} md={6} xl={4}>
              <ToolchainDisplay
                avatar={toolchain.languageLogo}
                name={toolchain.service}
                email={toolchain.version}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};
