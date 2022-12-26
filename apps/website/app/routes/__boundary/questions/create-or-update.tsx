import {
  AccountType,
  TestCaseUnit,
} from ':generated/graphql/orchestrator/generated/graphql';
import {
  TEST_CASE_UNITS,
  UPSERT_QUESTION,
} from ':generated/graphql/orchestrator/mutations';
import { QUESTION_DETAILS } from ':generated/graphql/orchestrator/queries';
import {
  Alert,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Input,
  ScrollArea,
  Stack,
  Tabs,
  TextInput,
  Title,
} from '@mantine/core';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { IconPlus } from '@tabler/icons';
import { useState } from 'react';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zx } from 'zodix';
import { QuestionProblem } from '~/lib/components/QuestionProblem';
import { TestCaseInput } from '~/lib/components/TestCases';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import {
  forbiddenError,
  getDataRepresentation,
  metaFunction,
} from '~/lib/utils';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import type {
  TestCase,
  InputCaseUnit,
  OutputCaseUnit,
  TestCaseFragment,
  UpsertQuestionInput,
} from ':generated/graphql/orchestrator/generated/graphql';

export const meta = metaFunction;

enum LoaderAction {
  Create = 'Create',
  Update = 'Update',
}

export async function loader({ request }: LoaderArgs) {
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher) forbiddenError();
  const { testCaseUnits } = await gqlClient.request(TEST_CASE_UNITS);
  const { questionSlug } = zx.parseQuery(request, {
    questionSlug: z.string().optional(),
  });
  // an edit page was requested
  if (!questionSlug)
    return json({
      action: LoaderAction.Create,
      testCaseUnits,
      defaultTestCases: [
        {
          inputs: [{ data: '', dataType: TestCaseUnit.String, name: 'line0' }],
          outputs: [{ data: '', dataType: TestCaseUnit.String }],
        },
      ],
      meta: { title: 'Create Question' },
    });
  invariant(typeof questionSlug === 'string', 'Slug should be a string');
  const { questionDetails } = await gqlClient.request(QUESTION_DETAILS, {
    questionSlug,
  });
  if (questionDetails.__typename === 'ApiError')
    throw badRequest({
      message: 'Question not found',
      description: 'You requested to edit a question that does not exist',
    });
  const testCases = questionDetails.testCases.map((testCase) => {
    const inputs = testCase.inputs.map((input, idx) => ({
      data: getDataRepresentation(input.data as TestCaseFragment),
      dataType: (input.data as TestCaseFragment).unitType,
      name: `line${idx}`,
    }));
    const outputs = testCase.outputs.map((output) => ({
      data: getDataRepresentation(output.data as TestCaseFragment),
      dataType: (output.data as TestCaseFragment).unitType,
    }));
    return { inputs, outputs };
  });
  return json({
    questionDetails,
    defaultTestCases: testCases,
    action: LoaderAction.Update,
    questionSlug,
    testCaseUnits,
  });
}

const actionSchema = z.object({
  data: z.string(),
  updateSlug: z.string().optional(),
});

export async function action({ request }: ActionArgs) {
  const { data } = await zx.parseForm(request, actionSchema);

  const input: UpsertQuestionInput = JSON.parse(data);

  const { upsertQuestion } = await gqlClient.request(
    UPSERT_QUESTION,
    { input },
    authenticatedRequest(request)
  );
  if (upsertQuestion.__typename === 'ApiError')
    throw new Error(upsertQuestion.error);
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

  const [activeTab, setActiveTab] = useState<string | null>('t-0');

  const loaderData = useLoaderData<typeof loader>();
  const { testCaseUnits, action, defaultTestCases } = loaderData;
  const isEditPage = 'questionDetails' in loaderData;

  const onSubmit = async () => {
    // remove the name field from all the test case outputs
    const newTestCases = testCases.map((testCase) => {
      const outputs = testCase.outputs.map(({ name, ...rest }: any) => rest);
      return { ...testCase, outputs };
    });
    const data: UpsertQuestionInput = {
      name: name,
      problem: problem.trim(),
      testCases: newTestCases,
      updateSlug: isEditPage ? loaderData.questionSlug : undefined,
    };
    const validatedData = actionSchema.parse({ data: JSON.stringify(data) });
    fetcher.submit(validatedData, { method: 'post' });
  };

  const [testCases, setTestCases] = useState<Array<TestCase>>(defaultTestCases);
  const [name, setName] = useState(
    isEditPage ? loaderData.questionDetails.name : ''
  );
  const [problem, setProblem] = useState(
    isEditPage ? loaderData.questionDetails.problem : ''
  );

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
        <Title order={1}>{action} Question</Title>
        <TextInput
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <Flex direction={'column'}>
          <Input.Wrapper label="Problem statement" required>
            <ScrollArea h={210}>
              <QuestionProblem text={problem} setText={setProblem} />
            </ScrollArea>
          </Input.Wrapper>
        </Flex>
        <Stack>
          <Input.Wrapper required>
            {testCases.length > 0 ? (
              <Tabs value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List>
                  {testCases.map((_, idx) => (
                    <Tabs.Tab value={`t-${idx}`} key={idx}>
                      Test Case {idx + 1}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
                {testCases.map((tCase, testCaseIdx) => (
                  <Tabs.Panel value={`t-${testCaseIdx}`} key={testCaseIdx}>
                    <Grid>
                      <Grid.Col md={6}>
                        <Stack p={'sm'}>
                          <Flex justify="space-between">
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
                            <TestCaseInput
                              key={inputCaseIdx}
                              textValue={input.data}
                              onTextChange={(e) => {
                                const value = e.currentTarget.value;
                                setData(
                                  testCaseIdx,
                                  inputCaseIdx,
                                  'inputs',
                                  'data',
                                  value
                                );
                              }}
                              selectValue={input.dataType}
                              testCaseUnits={testCaseUnits}
                              onSelectChange={(e) =>
                                setData(
                                  testCaseIdx,
                                  inputCaseIdx,
                                  'inputs',
                                  'dataType',
                                  e
                                )
                              }
                              actionBtnHandler={() =>
                                removeIndividualInputCase(
                                  testCaseIdx,
                                  inputCaseIdx,
                                  'inputs'
                                )
                              }
                            />
                          ))}
                        </Stack>
                      </Grid.Col>
                      <Grid.Col md={6}>
                        <Stack p={'sm'}>
                          <Flex justify="space-between">
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
                            <TestCaseInput
                              key={outputCaseIdx}
                              textValue={output.data}
                              onTextChange={(e) => {
                                const value = e.currentTarget.value;
                                setData(
                                  testCaseIdx,
                                  outputCaseIdx,
                                  'outputs',
                                  'data',
                                  value
                                );
                              }}
                              selectValue={output.dataType}
                              testCaseUnits={testCaseUnits}
                              onSelectChange={(e) =>
                                setData(
                                  testCaseIdx,
                                  outputCaseIdx,
                                  'outputs',
                                  'dataType',
                                  e
                                )
                              }
                              actionBtnHandler={() =>
                                removeIndividualInputCase(
                                  testCaseIdx,
                                  outputCaseIdx,
                                  'outputs'
                                )
                              }
                            />
                          ))}
                        </Stack>
                      </Grid.Col>
                    </Grid>
                  </Tabs.Panel>
                ))}
              </Tabs>
            ) : (
              <Alert color={'yellow'}>
                You have not configured any test cases
              </Alert>
            )}
          </Input.Wrapper>
        </Stack>
        <Divider variant={'dashed'} my={'md'} />
        <Flex justify={{ base: 'center', md: 'end' }} gap={'md'} wrap={'wrap'}>
          <Button
            variant={'light'}
            // I don't know why this has to be added, but otherwise there is a very slight
            // negative margin
            mt={1}
            color={'red'}
            onClick={removeTestCase}
          >
            Remove test case
          </Button>
          <Button variant={'light'} onClick={addTestCase}>
            Add test case
          </Button>
          <Button variant={'light'} color="green" onClick={onSubmit}>
            {action} Question
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
};
