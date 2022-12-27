import { SupportedLanguage } from ':generated/graphql/orchestrator/graphql';
import { EXECUTE_CODE_FOR_QUESTION } from ':graphql/orchestrator/mutations';
import {
  QUESTION_DETAILS,
  SUPPORTED_LANGUAGES,
} from ':graphql/orchestrator/queries';
import {
  Accordion,
  Box,
  Center,
  Code,
  Container,
  Grid,
  Paper,
  Progress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { Prism } from '@mantine/prism';
import { RichTextEditor } from '@mantine/tiptap';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { notFound } from 'remix-utils';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zx } from 'zodix';
import { CodeEditor } from '~/lib/components/CodeEditor';
import {
  DisplayErrorOutput,
  DisplaySuccessOutput,
} from '~/lib/components/DisplayOutput';
import { getDefaultExtensions } from '~/lib/editor';
import { gqlClient } from '~/lib/services/graphql.server';
import { metaFunction } from '~/lib/utils';
import type { ShouldReloadFunction } from '@remix-run/react';
import type { LoaderArgs, ActionArgs } from '@remix-run/node';

export const meta = metaFunction;

export async function loader({ params }: LoaderArgs) {
  const { supportedLanguages } = await gqlClient.request(SUPPORTED_LANGUAGES);
  const questionSlug = params.slug;
  invariant(typeof questionSlug === 'string', 'Slug should be a string');
  const { questionDetails } = await gqlClient.request(QUESTION_DETAILS, {
    questionSlug,
  });
  if (questionDetails.__typename === 'ApiError') throw notFound({});
  const meta = { title: `${questionDetails.name}` };
  const combinedQuestionDetails = {
    ...questionDetails,
    combinedTestCases: questionDetails.testCases.map((testCase) => ({
      input: testCase.inputs.map((input) => input.normalizedData).join(' '),
      output: testCase.outputs
        .map((output) => output.normalizedData)
        .join('\n'),
    })),
  };
  return json({
    supportedLanguages,
    combinedQuestionDetails,
    meta,
    questionSlug,
  });
}

export const unstable_shouldReload: ShouldReloadFunction = () => {
  return false;
};

const inputSchema = z.object({
  input: z.string(),
  language: z.nativeEnum(SupportedLanguage),
  questionSlug: z.string(),
});
type inputSchemaType = z.infer<typeof inputSchema>;

export async function action({ request }: ActionArgs) {
  const { input, language, questionSlug } = await zx.parseForm(
    request,
    inputSchema
  );
  const { executeCodeForQuestion } = await gqlClient.request(
    EXECUTE_CODE_FOR_QUESTION,
    {
      input: {
        questionSlug: questionSlug,
        executeInput: {
          arguments: [],
          code: JSON.parse(input),
          language: language,
        },
      },
    }
  );
  return json({ executeCodeForQuestion });
}

export default () => {
  const { supportedLanguages, combinedQuestionDetails, questionSlug } =
    useLoaderData<typeof loader>();
  const editor = useEditor({
    extensions: getDefaultExtensions(),
    editable: false,
    content: combinedQuestionDetails.problem,
  });
  const [language, setLanguage] = useState(SupportedLanguage.Python);
  const [code, setCode] = useState('');
  const fetcher = useFetcher<typeof action>();
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const testCaseStatus =
    fetcher?.data?.executeCodeForQuestion.__typename ===
      'ExecuteCodeForQuestionOutput' &&
    fetcher.data.executeCodeForQuestion.testCaseStatuses.at(selectedTestCase)!;

  useEffect(() => {
    if (
      fetcher.data?.executeCodeForQuestion.__typename ===
      'ExecuteCodeForQuestionOutput'
    ) {
      // find the first test case that has failed, and select it
      for (const [
        testCaseIndex,
        testCase,
      ] of fetcher.data.executeCodeForQuestion.testCaseStatuses.entries())
        if (testCase.__typename === 'TestCaseSuccessStatus') {
          if (!testCase.passed) {
            setSelectedTestCase(testCaseIndex);
            break;
          }
        } else {
          setSelectedTestCase(testCaseIndex);
          break;
        }
    }
  }, [fetcher.data]);

  return (
    <Container fluid mx={10}>
      <Stack>
        <Grid gutter={'lg'}>
          <Grid.Col md={6}>
            <Stack>
              <Title>{combinedQuestionDetails.name}</Title>
              <Paper withBorder>
                <ScrollArea h={250} type={'auto'}>
                  <RichTextEditor editor={editor} sx={{ borderWidth: 0 }}>
                    <RichTextEditor.Content />
                  </RichTextEditor>
                </ScrollArea>
              </Paper>
              <Paper withBorder>
                <ScrollArea h={200} type={'auto'}>
                  <Accordion>
                    {combinedQuestionDetails.combinedTestCases.map(
                      (testCase, idx) => {
                        const name = `Test Case ${idx + 1}`;
                        return (
                          <Accordion.Item key={idx} value={name}>
                            <Accordion.Control>{name}</Accordion.Control>
                            <Accordion.Panel>
                              <Stack>
                                <Box>
                                  <Text>Inputs</Text>
                                  <Code block>{testCase.input}</Code>
                                </Box>
                                <Box>
                                  <Text>Outputs</Text>
                                  <Code block>{testCase.output}</Code>
                                </Box>
                              </Stack>
                            </Accordion.Panel>
                          </Accordion.Item>
                        );
                      }
                    )}
                  </Accordion>
                </ScrollArea>
              </Paper>
            </Stack>
          </Grid.Col>
          <Grid.Col md={6}>
            <CodeEditor
              code={code}
              isSubmittingLoading={fetcher.state === 'submitting'}
              language={language}
              onSubmit={async () => {
                const data: inputSchemaType = {
                  input: JSON.stringify(code),
                  language,
                  questionSlug,
                };
                fetcher.submit(data, { method: 'post' });
              }}
              setCode={setCode}
              setLanguage={setLanguage}
              supportedLanguages={supportedLanguages}
              btnText={'Run test cases'}
            />
          </Grid.Col>
        </Grid>
        {fetcher.data && (
          <Center w={'100%'}>
            {fetcher.data.executeCodeForQuestion.__typename ===
            'ExecuteCodeForQuestionOutput' ? (
              <Stack w={{ base: 350, md: 500, xl: 650 }}>
                <SimpleGrid cols={3} spacing={'xs'}>
                  {fetcher.data.executeCodeForQuestion.testCaseStatuses.map(
                    (t, idx) => (
                      <Tooltip key={idx} label={`Test Case ${idx + 1}`}>
                        <UnstyledButton
                          onClick={() => setSelectedTestCase(idx)}
                        >
                          <Progress
                            key={idx}
                            value={100}
                            color={
                              t.__typename === 'ExecuteCodeError'
                                ? 'red'
                                : t.passed
                                ? 'green'
                                : 'red'
                            }
                            size={idx === selectedTestCase ? 'md' : 'sm'}
                          />
                        </UnstyledButton>
                      </Tooltip>
                    )
                  )}
                </SimpleGrid>
                {testCaseStatus &&
                  (testCaseStatus.__typename === 'ExecuteCodeError' ? (
                    <DisplayErrorOutput
                      errorOutput={testCaseStatus.error}
                      errorStep={testCaseStatus.step}
                    />
                  ) : testCaseStatus.passed ? (
                    <DisplaySuccessOutput
                      successStepTimings={testCaseStatus.time}
                      successOutput={testCaseStatus.userOutput}
                    />
                  ) : (
                    <Prism.Tabs defaultValue={'userOutput'}>
                      <Prism.TabsList>
                        <Prism.Tab value={'userOutput'}>User Output</Prism.Tab>
                        <Prism.Tab value={'expectedOutput'}>
                          Expected Output
                        </Prism.Tab>
                        <Prism.Tab value={'diff'}>Diff</Prism.Tab>
                      </Prism.TabsList>

                      <Prism.Panel value={'userOutput'} language={'markdown'}>
                        {testCaseStatus.userOutput}
                      </Prism.Panel>
                      <Prism.Panel
                        value={'expectedOutput'}
                        language={'markdown'}
                      >
                        {testCaseStatus.expectedOutput}
                      </Prism.Panel>
                      <Prism.Panel value={'diff'} language={'diff'}>
                        {testCaseStatus.diff}
                      </Prism.Panel>
                    </Prism.Tabs>
                  ))}
              </Stack>
            ) : (
              <Container size={'sm'}>
                <Paper p={'md'} withBorder>
                  <Code color={'red'}>
                    {fetcher.data.executeCodeForQuestion.error}
                  </Code>
                </Paper>
              </Container>
            )}
          </Center>
        )}
      </Stack>
    </Container>
  );
};
