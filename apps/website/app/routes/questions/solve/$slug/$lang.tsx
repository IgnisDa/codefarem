import {
  LANGUAGE_EXAMPLE,
  QUESTION_DETAILS,
  SUPPORTED_LANGUAGES,
} from ':generated/graphql/orchestrator/queries';
import { EXECUTE_CODE } from ':generated/graphql/orchestrator/mutations';
import type { TestCaseFragment } from ':generated/graphql/orchestrator/generated/graphql';
import {
  SupportedLanguage,
  TestCaseUnit,
} from ':generated/graphql/orchestrator/generated/graphql';
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
import type { LoaderArgs, ActionArgs, MetaFunction } from '@remix-run/node';
import {
  Text,
  Button,
  Grid,
  Loading,
  Collapse,
  Code,
  Card,
  Badge,
} from '@nextui-org/react';
import { ClientOnly, notFound } from 'remix-utils';

export const meta: MetaFunction = ({ data }) => {
  if (!data) return {};
  return data.meta;
};

export async function loader({ params }: LoaderArgs) {
  const { supportedLanguages } = await gqlClient.request(SUPPORTED_LANGUAGES);
  const selectedLanguage = params.lang as SupportedLanguage;
  invariant(
    supportedLanguages.includes(selectedLanguage),
    `Only the following languages are supported in the playground: '${supportedLanguages.join(
      ', '
    )}'`
  );
  const { languageExample } = await gqlClient.request(LANGUAGE_EXAMPLE, {
    language: selectedLanguage,
  });
  const questionSlug = params.slug;
  invariant(typeof questionSlug === 'string', 'Slug should be a string');
  const { questionDetails } = await gqlClient.request(QUESTION_DETAILS, {
    questionSlug,
  });
  if (questionDetails.__typename === 'ApiError')
    throw notFound({ title: 'Not found' });
  const meta = {
    title: `${questionDetails.name} | ${selectedLanguage.toUpperCase()}`,
  };
  return json({
    languageExample,
    supportedLanguages,
    selectedLanguage,
    questionDetails,
    meta,
    questionSlug,
  });
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
    },
  });
  return json({ output: executeCode.executeCode });
}

const DisplayData = (data: TestCaseFragment) => {
  const render = match(data.unitType)
    .with(
      TestCaseUnit.Number,
      TestCaseUnit.String,
      () => data.numberValue || data.stringValue || data.unitType
    )
    .with(TestCaseUnit.NumberCollection, TestCaseUnit.StringCollection, () =>
      (data.numberCollectionValue || data.stringCollectionValue || []).join(
        ', '
      )
    )
    .exhaustive();
  return render;
};

export default () => {
  const {
    languageExample,
    supportedLanguages,
    selectedLanguage,
    questionDetails,
    questionSlug,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [code, setCode] = useState(languageExample);
  const transition = useTransition();
  const isCodeExecutionSuccessful =
    actionData &&
    (actionData.output.__typename === 'ExecuteCodeOutput' || false);

  const extensions = match(selectedLanguage)
    .with(SupportedLanguage.Cpp, () => [cpp()])
    .with(SupportedLanguage.Rust, () => [rust()])
    .with(SupportedLanguage.Go, () => [StreamLanguage.define(go)])
    .exhaustive();

  return (
    <Grid.Container gap={2}>
      <Grid id="question-container" xs={4} direction={'column'}>
        <Text h1 transform="capitalize">
          {questionDetails.name}
        </Text>
        <ClientOnly fallback={'Loading...'}>
          {() => (
            <Text
              dangerouslySetInnerHTML={{
                __html: questionDetails.renderedProblem,
              }}
            />
          )}
        </ClientOnly>
        <Collapse.Group css={{ margin: 0, padding: 0 }}>
          {questionDetails.testCases.map((testCase, idx) => (
            <Collapse
              key={idx}
              title={`Test case ${idx + 1}`}
              expanded={idx === 0}
            >
              <Text b>Inputs</Text>
              {testCase.inputs.map((input, idxI) => (
                <div key={idxI}>
                  <Code>{DisplayData(input.data!)}</Code>
                </div>
              ))}
              <Text b>Outputs</Text>
              {testCase.outputs.map((output, idxI) => (
                <div key={idxI}>
                  <Code>{DisplayData(output.data!)}</Code>
                </div>
              ))}
            </Collapse>
          ))}
        </Collapse.Group>
      </Grid>
      <Grid xs={8} direction={'column'}>
        <Grid.Container>
          {supportedLanguages.map((l, idx) => (
            <Grid xs={4} key={idx}>
              <Text transform="uppercase">
                <Link
                  to={route('/questions/solve/:slug/:lang', {
                    slug: questionSlug,
                    lang: l,
                  })}
                  reloadDocument
                >
                  {l}
                </Link>
              </Text>
            </Grid>
          ))}
        </Grid.Container>
        <EditorView
          extensions={extensions}
          value={code}
          theme="dark"
          onChange={(val) => setCode(val)}
        />
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
            {transition.state !== 'idle' && <Loading color={'secondary'} />}
            Submit
          </Button>
        </Form>
        {actionData && (
          <Card variant="flat">
            <Card.Header>
              <Text>Output</Text>
            </Card.Header>
            <Card.Body css={{ py: '$2' }}>
              <Text color={isCodeExecutionSuccessful ? 'success' : 'error'}>
                {actionData.output.__typename === 'ExecuteCodeOutput'
                  ? actionData.output.output
                  : actionData.output.error}
              </Text>
            </Card.Body>
            <Card.Footer>
              <Badge
                color={isCodeExecutionSuccessful ? 'success' : 'error'}
                variant="dot"
              />
              <Text>{isCodeExecutionSuccessful ? 'Success' : 'Error'}</Text>
            </Card.Footer>
          </Card>
        )}
      </Grid>
    </Grid.Container>
  );
};
