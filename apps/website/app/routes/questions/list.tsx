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

const elementsPerPage = 2;

const schema = z.object({
  after: z.string().optional(),
  first: z.string().optional(),
  before: z.string().optional(),
  last: z.string().optional(),
});

export async function loader({ request }: LoaderArgs) {
  const { after, before, first, last } = zx.parseQuery(request, schema);
  const args = {
    first: !(first || last)
      ? elementsPerPage
      : first
      ? parseInt(first)
      : undefined,
    after: after,
    before: before,
    last: last ? parseInt(last) : undefined,
  };
  const { questionsConnection } = await gqlClient.request(
    QUESTIONS_CONNECTION,
    { args }
  );
  console.log(questionsConnection);
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
            href={`${route('/questions/list')}?before=${
              allQuestions.pageInfo.startCursor
            }&last=${elementsPerPage}`}
            disabled={!allQuestions.pageInfo.hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            component={'a'}
            href={`${route('/questions/list')}?after=${
              allQuestions.pageInfo.endCursor
            }&first=${elementsPerPage}`}
            disabled={!allQuestions.pageInfo.hasNextPage}
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};
