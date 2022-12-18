import {
  AccountType,
  TestCaseUnit,
} from ':generated/graphql/orchestrator/generated/graphql';
import {
  CREATE_QUESTION,
  TEST_CASE_UNITS,
} from ':generated/graphql/orchestrator/mutations';
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
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
  InputCaseUnit,
  OutputCaseUnit,
} from ':generated/graphql/orchestrator/generated/graphql';
import { IconMinus, IconPlus } from '@tabler/icons';
import { guessDataType } from '~/lib/utils';

export async function loader({ request }: LoaderArgs) {
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher)
    throw notFound({ message: 'Route not found' });
  const { testCaseUnits } = await gqlClient.request(TEST_CASE_UNITS);
  return json({ testCaseUnits });
}

export async function action({ request }: ActionArgs) {
  const input: CreateQuestionInput = JSON.parse(
    (await request.formData()).get('data')?.toString() || ''
  );

  const { createQuestion } = await gqlClient.request(
    CREATE_QUESTION,
    { input },
    authenticatedRequest(request)
  );
  if (createQuestion.__typename === 'ApiError')
    throw new Error(createQuestion.error);
  return redirect(route('/questions/list'));
}

const defaultOutput: OutputCaseUnit = {
  data: '',
  dataType: TestCaseUnit.String,
};

const defaultInput: InputCaseUnit = { ...defaultOutput, name: 'line0' };

type InputOrOutput = 'inputs' | 'outputs';
type DataOrDataType = 'data' | 'dataType';

export default () => {
  const fetcher = useFetcher();

  const onSubmit = async () => {
    // remove the name field from all the test case outputs
    const newTestCases = testCases.map((testCase) => {
      const outputs = testCase.outputs.map(({ name, ...rest }: any) => rest);
      return { ...testCase, outputs };
    });

    const data: CreateQuestionInput = {
      name: name,
      problem: problem,
      classIds: [],
      testCases: newTestCases,
    };
    fetcher.submit({ data: JSON.stringify(data) }, { method: 'post' });
  };

  const [activeTab, setActiveTab] = useState<string | null>('t-0');

  const { testCaseUnits } = useLoaderData<typeof loader>();

  const [testCases, setTestCases] = useState<Array<TestCase>>([
    {
      inputs: [{ data: '', dataType: TestCaseUnit.String, name: 'line0' }],
      outputs: [{ data: '', dataType: TestCaseUnit.String }],
    },
  ]);
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      { inputs: [defaultInput], outputs: [defaultOutput] },
    ]);
  };

  const removeTestCase = () => {
    setTestCases((prev) => {
      prev.pop();
      return [...prev];
    });
  };

  const addCase = (testCaseIdx: number, inputOrOutput: InputOrOutput) => {
    const newCases = [...testCases];
    newCases[testCaseIdx][inputOrOutput].push({
      ...defaultInput,
      name: `line${newCases[testCaseIdx][inputOrOutput].length}`,
    });
    setTestCases(newCases);
  };

  const removeIndividualInputCase = (
    testCaseIdx: number,
    caseIdx: number,
    inputOrOutput: InputOrOutput
  ) => {
    const newCases = [...testCases];
    newCases[testCaseIdx][inputOrOutput].splice(caseIdx, 1);
    setTestCases(newCases);
  };

  const setData = (
    testCaseIdx: number,
    caseIdx: number,
    inputOrOutput: InputOrOutput,
    dataOrDataType: DataOrDataType,
    data: string | InputCaseUnit
  ) => {
    const newCases = [...testCases];
    newCases[testCaseIdx][inputOrOutput][caseIdx][dataOrDataType] = data as any;
    setTestCases(newCases);
  };

  return (
    <Container>
      <Stack>
        <Title order={1}>Create a question</Title>
        <TextInput
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <Flex direction={'column'}>
          <Text>Problem statement</Text>
          <ScrollArea h={210}>
            <QuestionProblem text={problem} setText={setProblem} />
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
            {testCases.map((tCase, testCaseIdx) => (
              <Tabs.Panel pt={10} value={`t-${testCaseIdx}`} key={testCaseIdx}>
                <Flex gap={10}>
                  <Stack w={'50%'}>
                    <Flex px={10} justify="space-between">
                      <Title order={3}>Inputs</Title>
                      <Button
                        variant="light"
                        leftIcon={<IconPlus size={20} />}
                        compact
                        onClick={() => addCase(testCaseIdx, 'inputs')}
                      >
                        Add
                      </Button>
                    </Flex>
                    {tCase.inputs.map((input, inputCaseIdx) => (
                      <Flex gap={10} align={'center'} key={inputCaseIdx}>
                        <TextInput
                          required
                          value={input.data}
                          label="Data"
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            setData(
                              testCaseIdx,
                              inputCaseIdx,
                              'inputs',
                              'data',
                              value
                            );
                            const dataType = guessDataType(value);
                            setData(
                              testCaseIdx,
                              inputCaseIdx,
                              'inputs',
                              'dataType',
                              dataType
                            );
                          }}
                        />
                        <Select
                          required
                          data={testCaseUnits}
                          value={input.dataType}
                          label="Data type"
                          onChange={(e) =>
                            setData(
                              testCaseIdx,
                              inputCaseIdx,
                              'inputs',
                              'dataType',
                              e!
                            )
                          }
                        />
                        <ActionIcon
                          mt={20}
                          variant="filled"
                          onClick={() =>
                            removeIndividualInputCase(
                              testCaseIdx,
                              inputCaseIdx,
                              'inputs'
                            )
                          }
                        >
                          <IconMinus size={20} />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </Stack>
                  <Stack w={'50%'}>
                    <Flex px={10} justify="space-between">
                      <Title order={3}>Outputs</Title>
                      <Button
                        variant="light"
                        leftIcon={<IconPlus size={20} />}
                        compact
                        onClick={() => addCase(testCaseIdx, 'outputs')}
                      >
                        Add
                      </Button>
                    </Flex>
                    {tCase.outputs.map((output, outputCaseIdx) => (
                      <Flex gap={10} align={'center'} key={outputCaseIdx}>
                        <TextInput
                          required
                          value={output.data}
                          label="Data"
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            setData(
                              testCaseIdx,
                              outputCaseIdx,
                              'outputs',
                              'data',
                              value
                            );
                            const dataType = guessDataType(value);
                            setData(
                              testCaseIdx,
                              outputCaseIdx,
                              'outputs',
                              'dataType',
                              dataType
                            );
                          }}
                        />
                        <Select
                          required
                          data={testCaseUnits}
                          value={output.dataType}
                          label="Data type"
                          onChange={(e) =>
                            setData(
                              testCaseIdx,
                              outputCaseIdx,
                              'outputs',
                              'dataType',
                              e!
                            )
                          }
                        />
                        <ActionIcon
                          mt={20}
                          variant="filled"
                          onClick={() =>
                            removeIndividualInputCase(
                              testCaseIdx,
                              outputCaseIdx,
                              'outputs'
                            )
                          }
                        >
                          <IconMinus size={20} />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </Stack>
                </Flex>
              </Tabs.Panel>
            ))}
          </Tabs>
        </Stack>
        <Flex justify={'space-between'}>
          <Button color={'red'} onClick={removeTestCase}>
            Remove test case
          </Button>
          <Button onClick={addTestCase}>Add test case</Button>
        </Flex>
        <Flex justify={'end'}>
          <Button variant="filled" color="green" onClick={onSubmit}>
            Create Question
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
};
