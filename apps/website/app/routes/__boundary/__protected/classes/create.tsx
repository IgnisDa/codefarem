import { useFragment } from ':generated/graphql/orchestrator';
import {
  AccountType,
  CreateGoalInput
} from ':generated/graphql/orchestrator/graphql';
import { CREATE_GOAL, UPSERT_CLASS } from ':graphql/orchestrator/mutations';
import dayjs from 'dayjs';
import {
  SEARCH_QUESTIONS,
  SEARCH_USER_DETAILS_FRAGMENT,
  SEARCH_USERS
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
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { IconTrash } from '@tabler/icons';
import { set } from 'lodash';
import { forwardRef, useState } from 'react';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import { forbiddenError, metaFunction } from '~/lib/utils';
import type { SearchUserDetailsFragment } from ':generated/graphql/orchestrator/graphql';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import type { FragmentType } from ':generated/graphql/orchestrator';
import type { ComponentPropsWithoutRef } from 'react';

export const meta = metaFunction;

const convertFromFragmentList = (
  list: FragmentType<typeof SEARCH_USER_DETAILS_FRAGMENT>[],
  _accountType: AccountType
) => {
  return list.map((s) => {
    const frag = useFragment(SEARCH_USER_DETAILS_FRAGMENT, s);
    return {
      value: frag.id,
      details: frag.profile,
      label: frag.profile.username
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

type Goal = {
  name: string;
  color: string;
  dateRange: [string, string];
  questionInstances: { id: string; numTestCases: number; name: string }[];
};

export const loader = async ({ request }: LoaderArgs) => {
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher) forbiddenError();
  const { searchUsers } = await gqlClient.request(SEARCH_USERS, { input: {} });

  const { searchQuestions } = await gqlClient.request(SEARCH_QUESTIONS, {
    input: { queryString: '' }
  });
  const allQuestions = searchQuestions.results.map((s) => ({
    value: s.id,
    label: s.name,
    numTestCases: s.numTestCases
  }));
  const students = convertFromFragmentList(
    searchUsers.students,
    AccountType.Student
  );
  const teachers = convertFromFragmentList(
    searchUsers.teachers,
    AccountType.Teacher
  );
  const defaultGoals: Goal[] = [
    {
      name: 'Learn the basics',
      color: '#7b9c30',
      dateRange: ['2022-12-30', '2022-12-31'] as [string, string],
      questionInstances: []
    }
  ];
  return json({
    students,
    teachers,
    defaultGoals,
    allQuestions,
    meta: { title: 'Create class' }
  });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const input = {} as any;
  Object.entries(data).forEach(([key, value]) => {
    let newValue: any = value;
    if (key === 'teacherIds' || key === 'studentIds')
      newValue = value.toString().split(',').filter(Boolean);
    // range in the format of `'30 Dec – 31 Dec'`, needs to be converted to iso string
    else if (key.includes('range')) {
      const ranges = value.toString().split(' – ');
      newValue = {
        start: dayjs(ranges[0], 'DD MMM').toISOString(),
        end: dayjs(ranges[1], 'DD MMM').toISOString()
      };
    }
    set(input, key, newValue);
  });

  const goals: CreateGoalInput[] = input.goals;
  input.goals = undefined;

  const { upsertClass } = await gqlClient.request(
    UPSERT_CLASS,
    { input },
    authenticatedRequest(request)
  );
  if (upsertClass.__typename === 'ApiError')
    throw badRequest({ message: upsertClass.error });
  for (const goal of goals) {
    const { createGoal } = await gqlClient.request(
      CREATE_GOAL,
      { input: { ...goal, classId: upsertClass.id } },
      authenticatedRequest(request)
    );
    if (createGoal.__typename === 'ApiError')
      throw badRequest({ message: createGoal.error });
  }
  throw redirect(route('/classes'));
};

export default () => {
  const { students, teachers, defaultGoals, allQuestions } =
    useLoaderData<typeof loader>();

  const [goals, setGoals] = useState(defaultGoals);

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
              name="teacherIds"
              data={teachers}
              label={'Teachers'}
              placeholder="The teachers of the class, can be modified later"
              itemComponent={MultiSelectItem}
              searchable
            />
            <MultiSelect
              name="studentIds"
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
                  <Paper shadow="sm" radius="md" p={'md'} withBorder key={i}>
                    <Stack>
                      <Group>
                        <TextInput
                          label="Name"
                          required
                          name={`goals.${i}.name`}
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
                          name={`goals.${i}.range`}
                          required
                          value={[
                            new Date(goal.dateRange[0]),
                            new Date(goal.dateRange[1])
                          ]}
                          inputFormat="DD MMM"
                          dropdownType={'modal'}
                          onChange={(e) => {
                            if (e)
                              setGoals((prev) => {
                                const newGoals = [...prev];
                                const [start, end] = e;
                                newGoals[i].dateRange[0] =
                                  start?.toISOString() || '';
                                newGoals[i].dateRange[1] =
                                  end?.toISOString() || '';
                                return newGoals;
                              });
                          }}
                        />
                        <ColorInput
                          label="Color"
                          required
                          value={goal.color}
                          name={`goals.${i}.color`}
                          onChange={(e) => {
                            setGoals((prev) => {
                              const newGoals = [...prev];
                              newGoals[i].color = e;
                              return newGoals;
                            });
                          }}
                        />
                      </Group>
                      <Select
                        data={allQuestions.filter((q) => {
                          const index = goal.questionInstances.findIndex(
                            (qi) => qi.id === q.value
                          );
                          return index === -1;
                        })}
                        label="Questions for this goal"
                        placeholder="Start typing to search for questions"
                        searchable
                        clearable
                        onChange={(selected) => {
                          setGoals((prev) => {
                            const newGoals = [...prev];
                            const question = allQuestions.find(
                              (q) => q.value === selected
                            );
                            if (!question) return newGoals;
                            const index = newGoals[
                              i
                            ].questionInstances.findIndex(
                              (q) => q.id === question.value
                            );
                            if (index !== -1) return newGoals;
                            const newQuestion = {
                              id: question.value,
                              numTestCases: question.numTestCases,
                              name: question.label
                            };
                            newGoals[i].questionInstances.push(newQuestion);
                            return newGoals;
                          });
                        }}
                      />
                      {goal.questionInstances.length > 0 && (
                        <Flex gap={15} wrap={'wrap'}>
                          {goal.questionInstances.map((q, idx) => (
                            <Card shadow="sm" radius="md" withBorder key={q.id}>
                              <input
                                type="hidden"
                                name={`goals.${i}.questionIds[${idx}]]`}
                                value={q.id}
                              />
                              <Group position="apart">
                                <ActionIcon
                                  color={'red'}
                                  onClick={() => {
                                    setGoals((prev) => {
                                      const newGoals = [...prev];
                                      newGoals[i].questionInstances = newGoals[
                                        i
                                      ].questionInstances.filter(
                                        (qi) => qi.id !== q.id
                                      );
                                      return newGoals;
                                    });
                                  }}
                                >
                                  <IconTrash />
                                </ActionIcon>
                                <Text weight={500}>{q.name}</Text>
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
                  </Paper>
                ))}
                <Button
                  compact
                  variant={'default'}
                  onClick={() => {
                    const newGoal = {
                      name: '',
                      color: '',
                      dateRange: ['2022-12-30', '2022-12-31'] as [
                        string,
                        string
                      ],
                      questionInstances: []
                    };
                    setGoals((prev) => [...prev, newGoal]);
                  }}
                >
                  Add goal
                </Button>
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
