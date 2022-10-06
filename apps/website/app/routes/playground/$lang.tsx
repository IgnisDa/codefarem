import {
  ExecuteCodeMutation,
  SupportedLanguage,
} from '@codefarem/generated/graphql/generic-sdk';
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
import { makeDomainFunction } from 'domain-functions';
import { useState } from 'react';
import { formAction } from 'remix-forms';
import { route } from 'routes-gen';
import invariant from 'tiny-invariant';
import { match } from 'ts-pattern';
import { z } from 'zod';
import { Loading } from '@codefarem/react-ui';

import { graphqlSdk } from '../../lib/services/graphql.server';

import type { LoaderArgs, ActionArgs } from '@remix-run/node';

export async function loader({ params }: LoaderArgs) {
  const { supportedLanguages } = await graphqlSdk.SupportedLanguages();
  const selectedLanguage = params.lang as SupportedLanguage;
  invariant(
    supportedLanguages.includes(selectedLanguage as any),
    `Only the following languages are supported in the playground: '${supportedLanguages.join(
      ', '
    )}'`
  );
  const { languageExample } = await graphqlSdk.LanguageExample({
    language: selectedLanguage,
  });
  return json({ languageExample, supportedLanguages, selectedLanguage });
}

const schema = z.object({ input: z.string(), language: z.string() });

const mutation = makeDomainFunction(schema)(async (values) => {
  const executeCode = await graphqlSdk.ExecuteCode({
    input: {
      code: JSON.parse(values.input),
      language: values.language as SupportedLanguage,
    },
  });
  return executeCode;
});

export async function action({ request }: ActionArgs) {
  const executeCode = await formAction({ request, schema, mutation });
  let output: ExecuteCodeMutation = await executeCode.json();
  return json({ output: output });
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
    .with(SupportedLanguage.Go, () => [StreamLanguage.define(go)])
    .exhaustive();

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full space-y-10">
      <div>
        {transition.state !== 'idle' ? (
          <Loading />
        ) : (
          <div className="h-6"></div>
        )}
      </div>
      <div className="flex items-center space-x-3">
        {supportedLanguages.map((l, idx) => (
          <Link
            key={idx}
            to={route('/playground/:lang', { lang: l })}
            className="px-4 py-1 text-lg tracking-wider border border-purple-600 rounded-lg bg-purple-50"
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
        <button type="submit" className="p-2 border-2 rounded-lg bg-blue-50">
          Submit
        </button>
      </Form>
      <div className="flex w-full px-20 max-h-96">
        <div className="flex-1 w-1/3 p-2 font-mono bg-slate-600">
          {actionData &&
            (actionData.output.executeCode.__typename === 'ExecuteCodeError' ? (
              <div className="text-red-300">
                {actionData.output.executeCode.error}
              </div>
            ) : (
              <div className="text-white">
                {actionData.output.executeCode.output}
              </div>
            ))}
        </div>
        <div className="w-2/3 overflow-scroll">
          <EditorView
            extensions={extensions}
            value={code}
            theme="dark"
            className="text-lg"
            onChange={(val) => setCode(val)}
          />
        </div>
      </div>
    </div>
  );
};
