import { CLASSES_CONNECTION } from ':graphql/orchestrator/queries';
import {
  Alert,
  Anchor,
  Button,
  Container,
  Flex,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { route } from 'routes-gen';
import { withQuery } from 'ufo';
import { gqlClient } from '~/lib/services/graphql.server';
import { getArgs, metaFunction } from '~/lib/utils';
import type { LoaderArgs } from '@remix-run/node';

const elementsPerPage = 10;

export const meta = metaFunction;

export async function loader({ request }: LoaderArgs) {
  const args = getArgs(request, elementsPerPage);
  const { classesConnection } = await gqlClient.request(CLASSES_CONNECTION, {
    args,
  });
  return json({ classesConnection, meta: { title: 'All classes' } });
}

export default () => {
  const { classesConnection } = useLoaderData<typeof loader>();

  return (
    <Container size={'sm'} h={'100%'}>
      <Stack spacing={'xl'}>
        <Title>All Classes</Title>
        <Button component="a" href={route('/classes/action/create')}>
          Create a new class
        </Button>
        {classesConnection.edges.length === 0 ? (
          <Alert color={'red'}>There are no classes</Alert>
        ) : (
          <>
            <Table
              fontSize={'lg'}
              withColumnBorders
              withBorder
              highlightOnHover
            >
              <thead>
                <tr>
                  <th>
                    <Text>Invite String</Text>
                  </th>
                  <th>
                    <Text>Name</Text>
                  </th>
                  <th>
                    <Text>Teachers</Text>
                  </th>
                  <th>
                    <Text>Students</Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {classesConnection.edges.map(({ node }) => (
                  <tr key={node.id}>
                    <td>
                      <Anchor href={route('/classes/:id', { id: node.id })}>
                        {node.joinSlug}
                      </Anchor>
                    </td>
                    <td>{node.name}</td>
                    <td>{node.numTeachers}</td>
                    <td>{node.numStudents}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Flex justify={'end'} gap={20}>
              <Button
                component={'a'}
                href={withQuery(route('/classes'), {
                  before: classesConnection.pageInfo.startCursor,
                  last: String(elementsPerPage),
                })}
                disabled={!classesConnection.pageInfo.hasPreviousPage}
              >
                Previous
              </Button>
              <Button
                component={'a'}
                href={withQuery(route('/classes'), {
                  after: classesConnection.pageInfo.endCursor,
                  first: String(elementsPerPage),
                })}
                disabled={!classesConnection.pageInfo.hasNextPage}
              >
                Next
              </Button>
            </Flex>
          </>
        )}
      </Stack>
    </Container>
  );
};
