import { QUESTIONS_CONNECTION } from ':generated/graphql/orchestrator/queries';
import {
  Anchor,
  Button,
  Container,
  Flex,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { json } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { route } from 'routes-gen';
import { getQuery, parseURL, withQuery } from 'ufo';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';
import type { LoaderArgs } from '@remix-run/node';

const defaultElementsPerPage = 10;

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
      ? defaultElementsPerPage
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
  return json({ allQuestions: questionsConnection });
}

export default () => {
  const { allQuestions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container h={'100%'}>
      <Stack spacing={'xl'}>
        <Title>All Questions</Title>
        <Table fontSize={'lg'} withColumnBorders withBorder highlightOnHover>
          <thead>
            <tr>
              <th>
                <Text>ID</Text>
              </th>
              <th>
                <Text>Name</Text>
              </th>
              <th>
                <Text>Test cases</Text>
              </th>
              <th>
                <Text>Created on</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {allQuestions.edges.map(({ node }) => (
              <tr key={node.slug}>
                <td>
                  <Anchor
                    href={route('/questions/solve/:slug', {
                      slug: node.slug,
                    })}
                  >
                    {node.slug}
                  </Anchor>
                </td>
                <td>{node.name}</td>
                <td>{node.numTestCases}</td>
                <td>{new Date(node.createdTime).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Flex justify={'end'} gap={20}>
          <Select
            defaultValue={defaultElementsPerPage.toString()}
            onChange={(e) => {
              const parsedUrl = parseURL(location.search);
              const query = getQuery(parsedUrl.search);
              if (!query.first && !query.last) query.first = e;
              else if (query.first) query.first = e;
              else if (query.last) query.last = e;
              console.log(query);
              navigate(withQuery(route('/questions/list'), query));
            }}
            data={[
              { label: '10', value: '10' },
              { label: '15', value: '15' },
              { label: '20', value: '20' },
            ]}
          />
          <Button
            component={'a'}
            href={`${route('/questions/list')}?before=${
              allQuestions.pageInfo.startCursor
            }&last=${defaultElementsPerPage}`}
            disabled={!allQuestions.pageInfo.hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            component={'a'}
            href={`${route('/questions/list')}?after=${
              allQuestions.pageInfo.endCursor
            }&first=${defaultElementsPerPage}`}
            disabled={!allQuestions.pageInfo.hasNextPage}
          >
            Next
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
};
