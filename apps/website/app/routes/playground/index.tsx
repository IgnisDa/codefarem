import {
  LANGUAGE_EXAMPLE,
  SUPPORTED_LANGUAGES,
} from ':generated/graphql/orchestrator/queries';
import { EXECUTE_CODE } from ':generated/graphql/orchestrator/mutations';
import { SupportedLanguage } from ':generated/graphql/orchestrator/generated/graphql';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';
import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { Container } from '@mantine/core';
import { CodeEditor } from '~/lib/components/CodeEditor';

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
    languageExamples: Object.fromEntries(languageExamples),
    supportedLanguages,
  });
}
const inputSchema = z.object({
  input: z.string(),
  language: z.nativeEnum(SupportedLanguage),
});
type inputSchemaType = z.infer<typeof inputSchema>;

export async function action({ request }: ActionArgs) {
  const { input, language } = await zx.parseForm(request, inputSchema);
  const executeCode = await gqlClient.request(EXECUTE_CODE, {
    input: {
      code: JSON.parse(input),
      language: language as SupportedLanguage,
      arguments: [],
    },
  });
  return json({ output: executeCode.executeCode });
}

export default () => {
  const { languageExamples, supportedLanguages } =
    useLoaderData<typeof loader>();
  const [language, setLanguage] = useState(SupportedLanguage.Cpp);
  const [code, setCode] = useState(languageExamples[language]);
  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    setCode(languageExamples[language]);
  }, [language, languageExamples]);

  return (
    <Container>
      <CodeEditor
        code={code}
        isSubmittingLoading={fetcher.state === 'submitting'}
        language={language}
        onSubmit={async () => {
          const data: inputSchemaType = {
            input: JSON.stringify(code),
            language,
          };
          fetcher.submit(data, { method: 'post' });
        }}
        setCode={setCode}
        setLanguage={setLanguage}
        supportedLanguages={supportedLanguages}
      />
      {JSON.stringify(fetcher.data)}
    </Container>
  );
};