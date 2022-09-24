import { SupportedLanguage } from '@codefarem/generated/graphql/generic-sdk';
import { rust } from '@codemirror/lang-rust';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import EditorView from '@uiw/react-codemirror';
import { makeDomainFunction } from 'domain-functions';
import { useState } from 'react';
import { formAction } from 'remix-forms';
import { ClientOnly } from 'remix-utils';
import { route } from 'routes-gen';
import invariant from 'tiny-invariant';
import { z } from 'zod';

import { graphqlSdk } from '../../lib/graphql.server';

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

const schema = z.object({
  input: z.string(),
  language: z.nativeEnum(SupportedLanguage),
});

const mutation = makeDomainFunction(schema)(async (values) => {
  const { input, language } = values;
  const { executeCode } = await graphqlSdk.ExecuteCode({ input, language });
  return executeCode;
});

export async function action({ request }: ActionArgs) {
  const executeCode = await formAction({ request, schema, mutation });
  return json({ executeCode: await executeCode.json() });
}

export default () => {
  const { languageExample, supportedLanguages, selectedLanguage } =
    useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  const [code, setCode] = useState(languageExample);

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full space-y-10">
      {supportedLanguages.map((l, idx) => (
        <div key={idx}>
          <Link
            to={route('/playground/:lang', { lang: l })}
            className="px-4 py-1 text-lg tracking-wider border border-purple-600 rounded-lg bg-purple-50"
          >
            {l}
          </Link>
        </div>
      ))}
      <Form method="post">
        <input type="text" name="input" value={code} readOnly hidden />
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
        <div className="flex-1 w-1/3 p-2 font-mono text-red-300 bg-slate-600">
          {data && data.executeCode}
        </div>
        <div className="w-2/3 overflow-scroll">
          <ClientOnly fallback={`Loading ${selectedLanguage} editor`}>
            {() => (
              <EditorView
                extensions={[rust()]}
                value={code}
                theme="dark"
                className="text-xl"
                onChange={(val) => setCode(val)}
              />
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
};
