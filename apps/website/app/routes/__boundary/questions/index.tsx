import { DELETE_QUESTION } from ':graphql/orchestrator/mutations';
import { QUESTIONS_CONNECTION } from ':graphql/orchestrator/queries';
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
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import { withQuery } from 'ufo';
import { z } from 'zod';
import { zx } from 'zodix';
import { ListActions } from '~/lib/components/ListActions';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import {
  getArgs,
  metaFunction,
  PageAction,
  unprocessableEntityError,
} from '~/lib/utils';
import type { LoaderArgs, ActionArgs } from '@remix-run/node';

const elementsPerPage = 10;

export const meta = metaFunction;

export async function loader({ request }: LoaderArgs) {
  const args = getArgs(request, elementsPerPage);
  const { questionsConnection } = await gqlClient.request(
    QUESTIONS_CONNECTION,
    { args }
  );
  return json({
    allQuestions: questionsConnection,
    meta: { title: 'All questions' },
  });
}

const actionSchema = z.object({
  action: z.nativeEnum(PageAction),
  questionSlug: z.string(),
});

export async function action({ request }: ActionArgs) {
  const { action, questionSlug } = await zx.parseForm(request, actionSchema);
  if (action === PageAction.Delete) {
    const { deleteQuestion } = await gqlClient.request(
      DELETE_QUESTION,
      { input: { questionSlug } },
      authenticatedRequest(request)
    );
    if (deleteQuestion.__typename === 'ApiError')
      // TODO: set error flash message here
      return badRequest({ message: deleteQuestion.error });
    else return null;
  } else throw unprocessableEntityError('Invalid action');
}

export default () => {
  const { allQuestions } = useLoaderData<typeof loader>();

  return (
    <Container size={'sm'} h={'100%'}>
      <Stack spacing={'xl'}>
        <Title>All Questions</Title>
        <Button
          component="a"
          href={route('/questions/:choice-action', {
            choice: PageAction.Create,
          })}
        >
          Create a new question
        </Button>
        {allQuestions.edges.length === 0 ? (
          <Alert color={'red'}>There are no questions</Alert>
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
                    <td>
                      <Flex justify={'space-between'}>
                        <Text>
                          {new Date(node.createdTime).toLocaleDateString()}
                        </Text>
                        <ListActions
                          hasDuplicateAction
                          modalText="Are you sure you want to delete this question? Deleting a question
            will also delete all the test cases associated with it."
                          page="questions"
                          query={{ questionSlug: node.slug }}
                        />
                      </Flex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Flex justify={'end'} gap={20}>
              <Button
                component={'a'}
                href={withQuery(route('/questions'), {
                  before: allQuestions.pageInfo.startCursor,
                  last: String(elementsPerPage),
                })}
                disabled={!allQuestions.pageInfo.hasPreviousPage}
              >
                Previous
              </Button>
              <Button
                component={'a'}
                href={withQuery(route('/questions'), {
                  after: allQuestions.pageInfo.endCursor,
                  first: String(elementsPerPage),
                })}
                disabled={!allQuestions.pageInfo.hasNextPage}
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
