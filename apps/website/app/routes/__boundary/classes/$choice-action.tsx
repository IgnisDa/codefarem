import { DateRangePicker } from '@mantine/dates';
import { useFragment } from ':generated/graphql/orchestrator';
import { AccountType } from ':generated/graphql/orchestrator/graphql';
import { UPSERT_CLASS } from ':graphql/orchestrator/mutations';
import {
  SEARCH_USER_DETAILS_FRAGMENT,
  SEARCH_USERS,
} from ':graphql/orchestrator/queries';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  ColorInput,
  Container,
  Divider,
  Flex,
  Group,
  Input,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { json, redirect } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { forwardRef, useEffect, useState } from 'react';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import { withQuery } from 'ufo';
import { z } from 'zod';
import { zx } from 'zodix';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import { forbiddenError, verifyPageAction } from '~/lib/utils';
import type { SearchLoader } from '~/routes/api/searchQuestion';
import type { SearchUserDetailsFragment } from ':generated/graphql/orchestrator/graphql';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import type { FragmentType } from ':generated/graphql/orchestrator';
import type { ComponentPropsWithoutRef } from 'react';
import { IconTrash } from '@tabler/icons';

const convertFromFragmentList = (
  list: FragmentType<typeof SEARCH_USER_DETAILS_FRAGMENT>[],
  _accountType: AccountType
) => {
  return list.map((s) => {
    const frag = useFragment(SEARCH_USER_DETAILS_FRAGMENT, s);
    return {
      value: frag.id,
      details: frag.profile,
      label: frag.profile.username,
    };
  });
};

interface ItemProps extends ComponentPropsWithoutRef<'div'> {
  details: SearchUserDetailsFragment['profile'];
}

const MultiSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ details, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Text>{details.username}</Text>
      <Text color={'dimmed'}>{details.email}</Text>
    </div>
  )
);

export const loader = async ({ request, params }: LoaderArgs) => {
  const action = verifyPageAction(params);
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher) forbiddenError();
  const { searchUsers } = await gqlClient.request(SEARCH_USERS, { input: {} });

  const students = convertFromFragmentList(
    searchUsers.students,
    AccountType.Student
  );
  const teachers = convertFromFragmentList(
    searchUsers.teachers,
    AccountType.Teacher
  );
  const defaultGoals = [
    {
      name: 'Learn the basics',
      color: '#7b9c30',
      dateRange: ['2022-12-30', '2022-12-31'] as [string, string],
      questionInstances: [],
    },
  ];
  return json({ students, teachers, defaultGoals, action });
};

export const action = async ({ request }: ActionArgs) => {
  const { name, studentsData, teachersData, selectedQuestions } =
    await zx.parseForm(request.clone(), {
      name: z.string(),
      // the `MultiSelect` component returns a comma separated string of values
      studentsData: z.string(),
      teachersData: z.string(),
      selectedQuestions: z.string(),
    });

  const teacherIds = teachersData.split(',').filter(Boolean);
  const studentIds = studentsData.split(',').filter(Boolean);

  const { upsertClass } = await gqlClient.request(
    UPSERT_CLASS,
    { input: { name, teacherIds, studentIds } },
    authenticatedRequest(request)
  );
  if (upsertClass.__typename === 'ApiError')
    throw badRequest({ message: upsertClass.error });
  throw redirect(route('/classes'));
};

export default () => {
  const { students, teachers, defaultGoals } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<SearchLoader>();
  const [searchQuestion, setSearchQuestion] = useDebouncedState('', 300);
  const [selectedQuestions, setSelectedQuestions] = useState(
    new Set<{ label: string; value: string; numTestCases: number }>()
  );
  const [goals, setGoals] = useState<
    {
      name: string;
      color: string;
      dateRange: [string, string];
      questionInstances: string[];
    }[]
  >(defaultGoals);

  useEffect(() => {
    if (searchQuestion) {
      fetcher.load(
        withQuery(route('/api/searchQuestion'), {
          search: searchQuestion,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuestion]);

  return (
    <Container size={780}>
      <Stack>
        <Title>Create Class</Title>
        <Form method="post">
          <Stack>
            <TextInput
              label="Name"
              type={'text'}
              required
              name="name"
              placeholder={'A name for the class'}
            />
            <MultiSelect
              name="teachersData"
              data={teachers}
              label={'Teachers'}
              placeholder="The teachers of the class, can be modified later"
              itemComponent={MultiSelectItem}
              searchable
            />
            <MultiSelect
              name="studentsData"
              data={students}
              label={'Students'}
              placeholder="The students of the class, can be modified later"
              itemComponent={MultiSelectItem}
              searchable
            />

            <Input.Wrapper
              label="Goals"
              description="Each goal can have multiple questions"
              required
            >
              <Stack mt={'xs'}>
                {goals.map((goal, i) => (
                  <Card shadow="sm" radius="md" withBorder key={i}>
                    <Stack>
                      <Group>
                        <TextInput
                          label="Name"
                          required
                          value={goal.name}
                          onChange={(e) => {
                            setGoals((prev) => {
                              const newGoals = [...prev];
                              newGoals[i].name = e.target.value;
                              return newGoals;
                            });
                          }}
                        />
                        <DateRangePicker
                          label="Date range"
                          required
                          value={[
                            new Date(goal.dateRange[0]),
                            new Date(goal.dateRange[1]),
                          ]}
                          inputFormat="DD/MM/YYYY"
                          dropdownType={'modal'}
                        />
                        <ColorInput label="Color" required value={goal.color} />
                      </Group>
                      <MultiSelect
                        data={[
                          ...selectedQuestions,
                          ...(fetcher.data?.data || []),
                        ]}
                        required
                        name="selectedQuestions"
                        label="Questions for this goal"
                        placeholder="Start typing to search for questions"
                        searchable
                        clearable
                        onSearchChange={setSearchQuestion}
                        onChange={(values) => {
                          setSelectedQuestions((prev) => {
                            const newSet = new Set(prev);
                            values.forEach((a) => {
                              const data = fetcher.data?.data?.find(
                                (b) => b.value === a
                              );
                              if (data) newSet.add(data);
                            });
                            return newSet;
                          });
                        }}
                      />
                      {selectedQuestions.size > 0 && (
                        <Flex gap={15} wrap={'wrap'}>
                          {Array.from(selectedQuestions).map((q) => (
                            <Card
                              shadow="sm"
                              radius="md"
                              withBorder
                              key={q.value}
                            >
                              <Group position="apart">
                                <ActionIcon
                                  color={'red'}
                                  onClick={() => {
                                    setSelectedQuestions((prev) => {
                                      const newSet = new Set(prev);
                                      newSet.delete(q);
                                      return newSet;
                                    });
                                  }}
                                >
                                  <IconTrash />
                                </ActionIcon>
                                <Text weight={500}>{q.label}</Text>
                                <Badge color="pink" variant="light">
                                  {q.numTestCases} test case
                                  {q.numTestCases !== 1 && 's'}
                                </Badge>
                              </Group>
                            </Card>
                          ))}
                        </Flex>
                      )}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Input.Wrapper>
            <Divider variant={'dashed'} />
            <Flex
              justify={{ base: 'center', md: 'end' }}
              gap={'md'}
              wrap={'wrap'}
            >
              <Button variant={'light'} color="green" type={'submit'}>
                Create class
              </Button>
            </Flex>
          </Stack>
        </Form>
      </Stack>
    </Container>
  );
};
