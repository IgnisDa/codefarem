import {
  AccountType,
  TestCaseUnit
} from ':generated/graphql/orchestrator/graphql';
import {
  TEST_CASE_UNITS,
  UPSERT_QUESTION
} from ':graphql/orchestrator/mutations';
import { QUESTION_DETAILS } from ':graphql/orchestrator/queries';
import {
  Alert,
  Box,
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
  Title
} from '@mantine/core';
import { json, redirect } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { IconPlus } from '@tabler/icons';
import { useState } from 'react';
import { badRequest } from 'remix-utils';
import { route } from 'routes-gen';
import invariant from 'tiny-invariant';
import { match } from 'ts-pattern';
import { z } from 'zod';
import { zx } from 'zodix';
import { QuestionProblem } from '~/lib/components/QuestionProblem';
import { TestCaseInput } from '~/lib/components/TestCases';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import {
  forbiddenError,
  metaFunction,
  PageAction,
  verifyPageAction
} from '~/lib/utils';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import type {
  TestCase,
  InputCaseUnit,
  OutputCaseUnit,
  UpsertQuestionInput
} from ':generated/graphql/orchestrator/graphql';

export const meta = metaFunction;

const querySchema = z.object({
  questionSlug: z.string().optional()
});

type SimplifiedTestCase = {
  inputs: { data: string; dataType: TestCaseUnit; name: string }[];
  outputs: { data: string; dataType: TestCaseUnit }[];
};

export async function loader({ request, params }: LoaderArgs) {
  const action = verifyPageAction(params);

  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher) forbiddenError();

  const { questionSlug } = zx.parseQuery(request, querySchema);
  const { testCaseUnits } = await gqlClient.request(TEST_CASE_UNITS);

  const populatedData = await match(action)
    .with(PageAction.Update, PageAction.Duplicate, async () => {
      invariant(typeof questionSlug === 'string', 'Slug should be a string');
      const { questionDetails } = await gqlClient.request(QUESTION_DETAILS, {
        questionSlug
      });
      if (questionDetails.__typename === 'ApiError')
        throw badRequest({
          message: 'Question not found',
          description: 'You requested to edit a question that does not exist'
        });

      const testCases: SimplifiedTestCase[] = questionDetails.testCases.map(
        (testCase) => {
          const change = (data: typeof testCase.inputs) =>
            data.map((d, idx) => ({
              data: d.normalizedData,
              dataType: d.unitType,
              name: `line${idx}`
            }));
          const inputs = change(testCase.inputs);
          const outputs = change(testCase.outputs);
          return { inputs, outputs };
        }
      );
      return {
        name: questionDetails.name,
        problem: questionDetails.problem,
        testCases: testCases
      };
    })
    .with(PageAction.Create, PageAction.Delete, () => ({
      name: '',
      problem: '',
      testCases: [
        {
          inputs: [{ data: '', dataType: TestCaseUnit.String, name: 'line0' }],
          outputs: [{ data: '', dataType: TestCaseUnit.String }]
        }
      ]
    }))
    .exhaustive();

  return json({
    populatedData,
    action,
    questionSlug,
    testCaseUnits,
    meta: { title: `${action} Question` }
  });
}

const actionSchema = z.object({
  data: z.string(),
  updateSlug: z.string().optional()
});

export async function action({ request, params }: ActionArgs) {
  const action = params.choice as PageAction;

  const { data } = await zx.parseForm(request, actionSchema);

  const input: UpsertQuestionInput = JSON.parse(data);
  if (action === PageAction.Duplicate)
    // remove the slug from the input
    input.updateSlug = undefined;

  const { upsertQuestion } = await gqlClient.request(
    UPSERT_QUESTION,
    { input },
    authenticatedRequest(request)
  );
  if (upsertQuestion.__typename === 'ApiError')
    throw badRequest({ message: upsertQuestion.error });
  return redirect(route('/questions'));
}

const defaultOutput: OutputCaseUnit = {
  data: '',
  dataType: TestCaseUnit.String
};

const defaultInput: InputCaseUnit = { ...defaultOutput, name: 'line0' };

type InputOrOutput = 'inputs' | 'outputs';
type DataOrDataType = 'data' | 'dataType';

export default () => {
  const fetcher = useFetcher();

  const [activeTab, setActiveTab] = useState<string | null>('t-0');

  const { testCaseUnits, action, populatedData, questionSlug } =
    useLoaderData<typeof loader>();

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
      updateSlug: questionSlug
    };
    const validatedData = actionSchema.parse({ data: JSON.stringify(data) });
    fetcher.submit(validatedData, { method: 'post' });
  };

  const [testCases, setTestCases] = useState<Array<TestCase>>(
    populatedData.testCases
  );
  const [name, setName] = useState(populatedData.name);
  const [problem, setProblem] = useState(populatedData.problem);

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      { inputs: [defaultInput], outputs: [defaultOutput] }
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
      name: `line${newCases[testCaseIdx][inputOrOutput].length}`
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
      <Box component={Form} action={'post'}>
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
          <Flex
            justify={{ base: 'center', md: 'end' }}
            gap={'md'}
            wrap={'wrap'}
          >
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
      </Box>
    </Container>
  );
};
