import { ToggleGroup } from '@codefarem/react-ui';
import { rust } from '@codemirror/lang-rust';
import { useLoaderData } from '@remix-run/react';
import EditorView from '@uiw/react-codemirror';
import { zip } from 'lodash';
import { useState } from 'react';
import { ClientOnly } from 'remix-utils';
import invariant from 'tiny-invariant';

import { graphqlSdk } from '../../lib/graphql.server';

import type { LoaderArgs } from '@remix-run/node';

export async function loader({ params }: LoaderArgs) {
  const { supportedLanguages } = await graphqlSdk.SupportedLanguages();

  const selectedLanguage = params.lang as string;

  invariant(
    supportedLanguages.includes(selectedLanguage as any),
    `Only the following languages are supported in the playground '${supportedLanguages.join(
      ', '
    )}'`
  );

  const examples = supportedLanguages.map((l) =>
    graphqlSdk.LanguageExample({ language: l })
  );
  const languageExamples = await Promise.all(examples);
  return { languages: zip(supportedLanguages, languageExamples) };
}

export default () => {
  const { languages } = useLoaderData<typeof loader>();

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <div className="w-3/4 m-auto overflow-scroll h-96">
      <ToggleGroup items={languages.map((l) => ({ text: l[0] }))} />
      {languages.map((l, idx) => (
        <div key={idx}>
          <h1 className="text-3xl font-semibold">{l[0]}</h1>
          <ClientOnly fallback={`Loading ${l[0]} editor`}>
            {() => (
              <EditorView
                extensions={[rust()]}
                value={l[1].languageExample}
                theme="dark"
                className="text-xl"
              />
            )}
          </ClientOnly>
        </div>
      ))}
    </div>
  );
};
