import { ALL_QUESTIONS } from ':generated/graphql/orchestrator/queries';
import { Card, Container, Grid, Stack, Text, Title } from '@mantine/core';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { route } from 'routes-gen';
import { gqlClient } from '~/lib/services/graphql.server';
import type { LoaderArgs } from '@remix-run/node';

export async function loader(_args: LoaderArgs) {
  const { allQuestions } = await gqlClient.request(ALL_QUESTIONS, { args: {} });
  const questions = allQuestions.edges.map((edge) => edge.node);
  return json({
    allQuestions: questions,
  });
}

export default () => {
  const { allQuestions } = useLoaderData<typeof loader>();

  return (
    <Container size={'lg'}>
      <Stack>
        <Title>All Questions</Title>
        <Grid gutter={'xl'}>
          {allQuestions.map((question) => (
            <Grid.Col sm={12} md={4} key={question.slug}>
              <Card<'a'>
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                component="a"
                href={route('/questions/solve/:slug', { slug: question.slug })}
              >
                <Stack>
                  <Title order={3} underline>
                    {question.name}
                  </Title>
                  <Text>
                    Created on:{' '}
                    {new Date(question.createdTime).toLocaleDateString()}
                  </Text>
                  <Text>Test cases: {question.numTestCases}</Text>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};
