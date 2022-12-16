import { TestCaseUnit } from ':generated/graphql/orchestrator/generated/graphql';
import { EXECUTE_CODE_FOR_QUESTION } from ':generated/graphql/orchestrator/mutations';
import {
  QUESTION_DETAILS,
  SUPPORTED_LANGUAGES,
} from ':generated/graphql/orchestrator/queries';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { notFound } from 'remix-utils';
import invariant from 'tiny-invariant';
import { match } from 'ts-pattern';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';
import type { TestCaseFragment } from ':generated/graphql/orchestrator/generated/graphql';
import { SupportedLanguage } from ':generated/graphql/orchestrator/generated/graphql';
import type { LoaderArgs, ActionArgs, MetaFunction } from '@remix-run/node';
import {
  Accordion,
  Button,
  Code,
  Text,
  Container,
  Flex,
  Select,
  Stack,
  Box,
  Space,
  Paper,
} from '@mantine/core';
import { IconDeviceFloppy, IconPlayerPlay } from '@tabler/icons';
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';

export const meta: MetaFunction = ({ data }) => {
  if (!data) return {};
  return data.meta;
};

export async function loader({ params }: LoaderArgs) {
  const { supportedLanguages } = await gqlClient.request(SUPPORTED_LANGUAGES);
  const questionSlug = params.slug;
  invariant(typeof questionSlug === 'string', 'Slug should be a string');
  const { questionDetails } = await gqlClient.request(QUESTION_DETAILS, {
    questionSlug,
  });
  if (questionDetails.__typename === 'ApiError')
    throw notFound({ title: 'Not found' });
  const meta = { title: `${questionDetails.name}` };
  return json({
    supportedLanguages,
    questionDetails,
    meta,
    questionSlug,
  });
}

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

const DisplayData = (data: TestCaseFragment) => {
  return match(data.unitType)
    .with(TestCaseUnit.Number, TestCaseUnit.String, () =>
      String(data.numberValue || data.stringValue)
    )
    .with(TestCaseUnit.NumberCollection, TestCaseUnit.StringCollection, () =>
      (data.numberCollectionValue || data.stringCollectionValue || []).join(
        ', '
      )
    )
    .exhaustive();
};

export default () => {
  const { supportedLanguages, questionDetails, questionSlug } =
    useLoaderData<typeof loader>();
  const editor = useEditor({
    extensions: [StarterKit],
    editable: false,
    content: questionDetails.problem,
  });
  const [language, setLanguage] = useState(SupportedLanguage.Cpp);
  const [code, setCode] = useState('');
  const fetcher = useFetcher<typeof action>();

  return (
    <Container fluid mx={10}>
      <Flex gap={20}>
        <Stack w={'50%'}>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Content />
          </RichTextEditor>
          <Accordion>
            {questionDetails.testCases.map((testCase, idx) => {
              const name = `Test Case ${idx + 1}`;
              return (
                <Accordion.Item key={idx} value={name}>
                  <Accordion.Control>{name}</Accordion.Control>
                  <Accordion.Panel>
                    <Text>Inputs</Text>
                    {testCase.inputs.map((input, idx) => (
                      <Box key={idx}>
                        <Code>
                          {DisplayData(input.data as TestCaseFragment)}
                        </Code>
                      </Box>
                    ))}
                    <Text>Outputs</Text>
                    {testCase.outputs.map((output, idx) => (
                      <Box key={idx}>
                        <Code>
                          {DisplayData(output.data as TestCaseFragment)}
                        </Code>
                      </Box>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </Stack>
        <Stack w={'50%'}>
          <Flex justify={'space-between'} align={'center'}>
            <Select
              data={supportedLanguages.map((l) => ({
                label: l.toUpperCase(),
                value: l,
              }))}
              value={language}
              onChange={(e) => setLanguage(e as SupportedLanguage)}
            />
            <Button
              variant={'default'}
              leftIcon={<IconDeviceFloppy size={24} />}
            >
              Save
            </Button>
          </Flex>
          <Editor
            options={{ lineNumbers: 'off' }}
            height={'50vh'}
            language={language}
            theme={'vs-dark'}
            value={code}
            onChange={(value) => setCode(value || '')}
          />
          <Flex justify={'space-between'} align={'center'}>
            {/* TODO: Remove this element */}
            <div></div>
            <Button
              leftIcon={<IconPlayerPlay size={24} />}
              loading={fetcher.state === 'submitting'}
              onClick={() => {
                const data: inputSchemaType = {
                  input: JSON.stringify(code),
                  language,
                  questionSlug,
                };
                fetcher.submit(data, { method: 'post' });
              }}
            >
              Run Test Cases
            </Button>
          </Flex>
        </Stack>
      </Flex>
      <Container>
        {fetcher.data && (
          <>
            <Space h={'lg'} />
            <Paper shadow="lg" p="md" withBorder>
              {JSON.stringify(fetcher.data)}
            </Paper>
          </>
        )}
      </Container>
    </Container>
  );
};
