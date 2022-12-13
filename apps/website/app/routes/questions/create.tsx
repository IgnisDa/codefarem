import {
  AccountType,
  SupportedLanguage,
  TestCaseUnit,
} from ':generated/graphql/orchestrator/generated/graphql';
import {
  CREATE_QUESTION,
  TEST_CASE_UNITS,
} from ':generated/graphql/orchestrator/mutations';
import {
  Button,
  Container,
  Flex,
  Group,
  ScrollArea,
  Select,
  Space,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { set } from 'lodash';
import { useState } from 'react';
import { notFound } from 'remix-utils';
import { route } from 'routes-gen';
import { QuestionProblem } from '~/lib/components/QuestionProblem';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import type {
  CreateQuestionInput,
  TestCase,
} from ':generated/graphql/orchestrator/generated/graphql';

export async function loader({ request }: LoaderArgs) {
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher)
    throw notFound({ message: 'Route not found' });
  const { testCaseUnits } = await gqlClient.request(TEST_CASE_UNITS);
  return json({ testCaseUnits });
}

export async function action({ request }: ActionArgs) {
  let input: CreateQuestionInput = {} as any;
  for (const [key, value] of await request.formData()) set(input, key, value);

  // if there are no test cases at all
  if (!input.testCases?.length) input.testCases = [];

  // handle the case when input/output is empty for a test case
  input.testCases.forEach((tCase, idx, theArr) => {
    if (!tCase.inputs) theArr[idx].inputs = [];
    if (!tCase.outputs) theArr[idx].outputs = [];
  });

  input.classIds = [];
  const { createQuestion } = await gqlClient.request(
    CREATE_QUESTION,
    { input },
    authenticatedRequest(request)
  );
  if (createQuestion.__typename === 'ApiError')
    throw new Error(createQuestion.error);
  return redirect(
    route('/questions/solve/:slug/:lang', {
      slug: createQuestion.slug,
      lang: SupportedLanguage.Cpp,
    })
  );
}

export default () => {
  const [activeTab, setActiveTab] = useState<string | null>('t-0');

  const { testCaseUnits } = useLoaderData<typeof loader>();

  const [testCases, setTestCases] = useState<Array<TestCase>>([
    {
      inputs: [{ data: '', dataType: TestCaseUnit.String, name: 'line0' }],
      outputs: [{ data: '', dataType: TestCaseUnit.String }],
    },
  ]);

  return (
    <Container w={'100%'} mx={{ xs: 10, md: 20 }}>
      <Stack>
        <Title order={1}>Create a question</Title>
        <TextInput label="Name" required />
        <Flex direction={'column'}>
          <Text>Problem statement</Text>
          <ScrollArea h={210}>
            <QuestionProblem />
          </ScrollArea>
        </Flex>
        <Stack>
          <Text>Test cases</Text>
          <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List>
              {testCases.map((_, idx) => (
                <Tabs.Tab value={`t-${idx}`} key={idx}>
                  Test Case {idx + 1}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {testCases.map((tCase, idx) => (
              <Tabs.Panel pt={10} value={`t-${idx}`} key={idx}>
                <Flex gap={10}>
                  <Stack>
                    <Title order={3}>Inputs</Title>
                    <Flex gap={20}>
                      <Button
                        onClick={() => {
                          const newCases = [...testCases];
                          newCases[idx].inputs.push({
                            data: '',
                            dataType: TestCaseUnit.String,
                            name: `line${testCases[idx].inputs.length}`,
                          });
                          setTestCases(newCases);
                        }}
                      >
                        Add another input
                      </Button>
                      <Button
                        color={'red'}
                        onClick={() => {
                          const newCases = [...testCases];
                          newCases[idx].inputs.pop();
                          setTestCases(newCases);
                        }}
                      >
                        Remove last input
                      </Button>
                    </Flex>
                    {tCase.inputs.map((input, idx) => (
                      <Group key={idx}>
                        <TextInput required value={input.data} label="Data" />
                        <Select
                          required
                          data={testCaseUnits}
                          value={input.dataType}
                          label="Data type"
                        />
                      </Group>
                    ))}
                  </Stack>
                  <Stack>
                    <Title order={3}>Outputs</Title>
                    <Flex gap={20}>
                      <Button
                        onClick={() => {
                          const newCases = [...testCases];
                          newCases[idx].outputs.push({
                            data: '',
                            dataType: TestCaseUnit.String,
                          });
                          setTestCases(newCases);
                        }}
                      >
                        Add another output
                      </Button>
                      <Button
                        color={'red'}
                        onClick={() => {
                          const newCases = [...testCases];
                          newCases[idx].outputs.pop();
                          setTestCases(newCases);
                        }}
                      >
                        Remove last output
                      </Button>
                    </Flex>
                    {tCase.outputs.map((output, idx) => (
                      <Group key={idx}>
                        <TextInput required value={output.data} label="Data" />
                        <Select
                          required
                          data={testCaseUnits}
                          value={output.dataType}
                          label="Data type"
                        />
                      </Group>
                    ))}
                  </Stack>
                </Flex>
              </Tabs.Panel>
            ))}
          </Tabs>
        </Stack>
        <Flex justify={'space-between'}>
          <Button
            color={'red'}
            onClick={() => {
              const idx = Number(activeTab?.split('-')[1]) - 1;
              testCases.splice(idx, 1);
              const newTestCases = [...testCases];
              setTestCases(newTestCases);
            }}
          >
            Delete this test case
          </Button>
          <Button
            onClick={() => {
              setTestCases([
                ...testCases,
                {
                  inputs: [
                    { data: '', dataType: TestCaseUnit.String, name: 'line0' },
                  ],
                  outputs: [{ data: '', dataType: TestCaseUnit.String }],
                },
              ]);
            }}
          >
            Add test case
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
};
