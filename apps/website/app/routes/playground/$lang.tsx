import {
  LANGUAGE_EXAMPLE,
  SUPPORTED_LANGUAGES,
} from ':generated/graphql/orchestrator/queries';
import { EXECUTE_CODE } from ':generated/graphql/orchestrator/mutations';
import { SupportedLanguage } from ':generated/graphql/orchestrator/generated/graphql';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { json } from '@remix-run/node';
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import EditorView from '@uiw/react-codemirror';
import { useState } from 'react';
import { route } from 'routes-gen';
import invariant from 'tiny-invariant';
import { match } from 'ts-pattern';
import { z } from 'zod';
import { zx } from 'zodix';
import { gqlClient } from '~/lib/services/graphql.server';
import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { Button, Loader } from '@mantine/core';

export async function loader({ params }: LoaderArgs) {
  const { supportedLanguages } = await gqlClient.request(SUPPORTED_LANGUAGES);
  const selectedLanguage = params.lang as SupportedLanguage;
  invariant(
    supportedLanguages.includes(selectedLanguage as any),
    `Only the following languages are supported in the playground: '${supportedLanguages.join(
      ', '
    )}'`
  );
  const { languageExample } = await gqlClient.request(LANGUAGE_EXAMPLE, {
    language: selectedLanguage,
  });
  return json({ languageExample, supportedLanguages, selectedLanguage });
}

export async function action({ request }: ActionArgs) {
  const { input, language } = await zx.parseForm(request, {
    input: z.string(),
    language: z.string(),
  });
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
  const { languageExample, supportedLanguages, selectedLanguage } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [code, setCode] = useState(languageExample);
  const transition = useTransition();

  const extensions = match(selectedLanguage)
    .with(SupportedLanguage.Cpp, () => [cpp()])
    .with(SupportedLanguage.Rust, () => [rust()])
    // @ts-ignore: no @codemirror/lang-go package and the one we are using works fine
    .with(SupportedLanguage.Go, () => [StreamLanguage.define(go)])
    .exhaustive();

  return (
    <div>
      <div>
        {supportedLanguages.map((l, idx) => (
          <Link
            key={idx}
            to={route('/playground/:lang', { lang: l })}
            reloadDocument
          >
            {l}
          </Link>
        ))}
      </div>
      <Form method="post">
        <input
          type="text"
          name="input"
          value={JSON.stringify(code)}
          readOnly
          hidden
        />
        <input
          type="text"
          name="language"
          value={selectedLanguage}
          readOnly
          hidden
        />
        <Button type="submit">
          {transition.state !== 'idle' && <Loader color={'green'} />}
          Submit
        </Button>
      </Form>
      <div>
        <div>
          {actionData &&
            (actionData.output.__typename === 'ExecuteCodeError' ? (
              <div>{actionData.output.error}</div>
            ) : (
              <div>{actionData.output.output}</div>
            ))}
        </div>
        <div>
          <EditorView
            extensions={extensions}
            value={code}
            theme="dark"
            onChange={(val) => setCode(val)}
          />
        </div>
      </div>
    </div>
  );
};
