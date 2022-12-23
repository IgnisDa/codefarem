import { QUESTIONS_CONNECTION } from ':generated/graphql/orchestrator/queries';
import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';
import type { LoaderArgs } from '@remix-run/node';

const elementsPerPage = 4;

export async function loader({ request }: LoaderArgs) {
  const { after } = zx.parseQuery(request, {
    after: z.string().optional(),
  });
  const { questionsConnection } = await gqlClient.request(
    QUESTIONS_CONNECTION,
    { args: { first: elementsPerPage, after: after } }
  );
  return json({ allQuestions: questionsConnection });
}

export default () => {
  const { allQuestions } = useLoaderData<typeof loader>();

  return (
    <Container size={'lg'} h={'100%'}>
      <Flex direction={'column'} justify={'space-between'} h={'100%'}>
        <Stack>
          <Title>All Questions</Title>
          <Grid gutter={'xl'}>
            {allQuestions.edges.map(({ node }) => (
              <Grid.Col sm={12} md={4} key={node.slug}>
                <Card<'a'>
                  shadow="sm"
                  p="lg"
                  radius="md"
                  withBorder
                  component="a"
                  href={route('/questions/solve/:slug', { slug: node.slug })}
                >
                  <Stack>
                    <Title order={3} underline>
                      {node.name}
                    </Title>
                    <Text>
                      Created on:{' '}
                      {new Date(node.createdTime).toLocaleDateString()}
                    </Text>
                    <Text>Test cases: {node.numTestCases}</Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
        <Flex justify={'center'} gap={20}>
          <Button
            component={'a'}
            href={`${route('/questions/list')}?after=${
              allQuestions.pageInfo.startCursor
            }`}
            disabled={!allQuestions.pageInfo.hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            component={'a'}
            href={`${route('/questions/list')}?after=${
              allQuestions.pageInfo.endCursor
            }`}
            disabled={!allQuestions.pageInfo.hasNextPage}
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};
