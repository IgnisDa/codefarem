import {
  SupportedLanguage,
  TestCaseUnit,
} from ':generated/graphql/orchestrator/generated/graphql';
import { EXECUTE_CODE } from ':generated/graphql/orchestrator/mutations';
import {
  LANGUAGE_EXAMPLE,
  SUPPORTED_LANGUAGES,
} from ':generated/graphql/orchestrator/queries';
import {
  Button,
  Container,
  Divider,
  Drawer,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { IconDeviceFloppy, IconSettings } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zx } from 'zodix';
import { CodeEditor } from '~/lib/components/CodeEditor';
import {
  DisplayErrorOutput,
  DisplaySuccessOutput,
} from '~/lib/components/DisplayOutput';
import { TestCaseInput } from '~/lib/components/TestCases';
import { gqlClient } from '~/lib/services/graphql.server';
import { guessDataType, metaFunction } from '~/lib/utils';
import type { InputCaseUnit } from ':generated/graphql/orchestrator/generated/graphql';
import type { ShouldReloadFunction } from '@remix-run/react';
import type { LoaderArgs, ActionArgs } from '@remix-run/node';

export const meta = metaFunction;

export const unstable_shouldReload: ShouldReloadFunction = () => {
  return false;
};

export async function loader(_args: LoaderArgs) {
  const { supportedLanguages } = await gqlClient.request(SUPPORTED_LANGUAGES);
  const languageExamples: Map<SupportedLanguage, string> = new Map();
  for (const lang of supportedLanguages) {
    const { languageExample } = await gqlClient.request(LANGUAGE_EXAMPLE, {
      language: lang,
    });
    languageExamples.set(lang, languageExample);
  }
  return json({
    meta: { title: 'Playground' },
    languageExamples: Object.fromEntries(languageExamples),
    supportedLanguages,
  });
}

const inputSchema = z.object({
  input: z.string(),
  language: z.nativeEnum(SupportedLanguage),
  args: z.string(),
});
type inputSchemaType = z.infer<typeof inputSchema>;

export async function action({ request }: ActionArgs) {
  const { input, language, args } = await zx.parseForm(request, inputSchema);
  const sanitizedArgs = JSON.parse(args);
  const executeCode = await gqlClient.request(EXECUTE_CODE, {
    input: {
      code: JSON.parse(input),
      language: language as SupportedLanguage,
      arguments: sanitizedArgs,
    },
  });
  return json({ output: executeCode.executeCode });
}

export default () => {
  const theme = useMantineTheme();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const { languageExamples, supportedLanguages } =
    useLoaderData<typeof loader>();
  const [language, setLanguage] = useState(SupportedLanguage.Python);
  const [code, setCode] = useState(languageExamples[language]);
  const fetcher = useFetcher<typeof action>();
  const [args, setArgs] = useState<InputCaseUnit[]>([]);
  const testCaseUnits = Object.values(TestCaseUnit);

  useEffect(() => {
    setCode(languageExamples[language]);
  }, [language, languageExamples]);

  return (
    <Container>
      <Stack spacing={20}>
        <CodeEditor
          code={code}
          isSubmittingLoading={fetcher.state === 'submitting'}
          language={language}
          onSubmit={async () => {
            const data: inputSchemaType = {
              input: JSON.stringify(code),
              language,
              args: JSON.stringify(args),
            };
            fetcher.submit(data, { method: 'post' });
          }}
          setCode={setCode}
          setLanguage={setLanguage}
          supportedLanguages={supportedLanguages}
          btnText={'Execute'}
          leftButton={
            <Button
              color={'indigo'}
              onClick={() => setDrawerOpened(true)}
              leftIcon={<IconSettings />}
            >
              Settings
            </Button>
          }
        />
        {fetcher.data &&
          (fetcher.data.output.__typename === 'ExecuteCodeError' ? (
            <DisplayErrorOutput
              errorOutput={fetcher.data.output.error}
              errorStep={fetcher.data.output.step}
            />
          ) : (
            <DisplaySuccessOutput
              successStepTimings={fetcher.data.output.time}
              successOutput={fetcher.data.output.output}
            />
          ))}
      </Stack>
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        overlayColor={theme.colors.dark[9]}
        overlayOpacity={0.55}
        overlayBlur={3}
        position={'right'}
        title={<Title order={2}>Settings</Title>}
        padding={'xl'}
        size={'xl'}
        lockScroll
        withCloseButton={false}
      >
        <Stack>
          <Button
            variant={'light'}
            onClick={() =>
              setArgs((state) => [
                ...state,
                {
                  data: '',
                  dataType: TestCaseUnit.String,
                  name: `arg${state.length}`,
                },
              ])
            }
          >
            Add argument
          </Button>
          {args.map((arg, idx) => (
            <TestCaseInput
              key={idx}
              textValue={arg.data}
              onTextChange={(e) => {
                const newArgs = [...args];
                const value = e.currentTarget.value;
                const dataType = guessDataType(value);
                newArgs[idx].data = value;
                newArgs[idx].dataType = dataType;
                setArgs(newArgs);
              }}
              selectValue={arg.dataType}
              testCaseUnits={testCaseUnits}
              onSelectChange={(e) => {
                const newArgs = [...args];
                newArgs[idx].dataType = e as TestCaseUnit;
                setArgs(newArgs);
              }}
              actionBtnHandler={() => {
                const newArgs = [...args];
                newArgs.splice(idx, 1);
                setArgs(newArgs);
              }}
            />
          ))}
        </Stack>
        <Divider my={'md'} variant={'dashed'} />
        <Button
          w={'100%'}
          variant={'light'}
          color={'green'}
          onClick={() => setDrawerOpened(false)}
          leftIcon={<IconDeviceFloppy />}
        >
          Done
        </Button>
      </Drawer>
    </Container>
  );
};
