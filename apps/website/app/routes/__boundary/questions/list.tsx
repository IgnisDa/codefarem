import { DELETE_QUESTION } from ':generated/graphql/orchestrator/mutations';
import { QUESTIONS_CONNECTION } from ':generated/graphql/orchestrator/queries';
import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Button,
  Container,
  Flex,
  Menu,
  Modal,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { IconCopy, IconDots, IconEdit, IconTrash } from '@tabler/icons';
import { useState } from 'react';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import { withQuery } from 'ufo';
import { z } from 'zod';
import { zx } from 'zodix';
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

enum ActionType {
  DELETE = 'Delete',
}

const actionSchema = z.object({
  action: z.nativeEnum(ActionType),
  questionSlug: z.string(),
});

export async function action({ request }: ActionArgs) {
  const { action, questionSlug } = await zx.parseForm(request, actionSchema);
  if (action === ActionType.DELETE) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                        <Menu width={200}>
                          <Menu.Target>
                            <ActionIcon variant={'default'}>
                              <IconDots />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Label>Actions</Menu.Label>
                            <Menu.Item icon={<IconEdit size={14} />}>
                              <Anchor
                                href={withQuery(
                                  `${route('/questions/:choice-action', {
                                    choice: PageAction.Update,
                                  })}`,
                                  { questionSlug: node.slug }
                                )}
                                variant={'text'}
                                display={'block'}
                              >
                                Update
                              </Anchor>
                            </Menu.Item>
                            <Menu.Item icon={<IconCopy size={14} />}>
                              <Anchor
                                href={withQuery(
                                  `${route('/questions/:choice-action', {
                                    choice: PageAction.Duplicate,
                                  })}`,
                                  {
                                    questionSlug: node.slug,
                                  }
                                )}
                                variant={'text'}
                                display={'block'}
                              >
                                Duplicate
                              </Anchor>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Label>Danger zone</Menu.Label>
                            <Menu.Item
                              color="red"
                              icon={<IconTrash size={14} />}
                              onClick={() => setIsModalOpen((o) => !o)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                        <Modal
                          size="sm"
                          centered
                          title="Delete question"
                          opened={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          overlayOpacity={0.55}
                          overlayBlur={3}
                        >
                          <Stack>
                            <Box>
                              Are you sure you want to delete this question?
                              Deleting a question will also delete all the test
                              cases associated with it.
                            </Box>
                            <Flex justify={'space-between'}>
                              <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Form method={'post'} reloadDocument>
                                <input
                                  type="hidden"
                                  name="questionSlug"
                                  value={node.slug}
                                />
                                <Button
                                  color="red"
                                  type={'submit'}
                                  name={'action'}
                                  value={ActionType.DELETE}
                                >
                                  {ActionType.DELETE}
                                </Button>
                              </Form>
                            </Flex>
                          </Stack>
                        </Modal>
                      </Flex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Flex justify={'end'} gap={20}>
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
          </>
        )}
      </Stack>
    </Container>
  );
};
