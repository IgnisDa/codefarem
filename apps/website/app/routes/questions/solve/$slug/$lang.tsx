import {
  LANGUAGE_EXAMPLE,
  QUESTION_DETAILS,
  SUPPORTED_LANGUAGES,
} from ':generated/graphql/orchestrator/queries';
import { EXECUTE_CODE_FOR_QUESTION } from ':generated/graphql/orchestrator/mutations';
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
  Container,
} from '@nextui-org/react';
import { notFound } from 'remix-utils';

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
  const { input, language, questionSlug } = await zx.parseForm(request, {
    input: z.string(),
    language: z.string(),
    questionSlug: z.string(),
  });
  const { executeCodeForQuestion } = await gqlClient.request(
    EXECUTE_CODE_FOR_QUESTION,
    {
      input: {
        questionSlug: questionSlug,
        executeInput: {
          arguments: [],
          code: JSON.parse(input),
          language: language as SupportedLanguage,
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
        <Collapse.Group css={{ margin: 0, padding: 0 }}>
          <div
            dangerouslySetInnerHTML={{
              __html: questionDetails.renderedProblem,
            }}
          />
          {questionDetails.testCases.map((testCase, idx) => (
            <Collapse
              key={idx}
              title={`Test case ${idx + 1}`}
              expanded={idx === 0}
            >
              <Text b>Inputs</Text>
              {testCase.inputs.map((input, idxI) => (
                <div key={idxI}>
                  <Code>{DisplayData(input.data as TestCaseFragment)}</Code>
                </div>
              ))}
              <Text b>Outputs</Text>
              {testCase.outputs.map((output, idxI) => (
                <div key={idxI}>
                  <Code>{DisplayData(output.data as TestCaseFragment)}</Code>
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
          <input
            type="text"
            name="questionSlug"
            value={questionSlug}
            hidden
            readOnly
          />
          <Button type="submit">
            {transition.state !== 'idle' && <Loading color={'secondary'} />}
            Submit
          </Button>
        </Form>
        {actionData &&
          actionData.executeCodeForQuestion.__typename ===
            'ExecuteCodeForQuestionOutput' &&
          actionData.executeCodeForQuestion.testCaseStatuses.map((t, idx) => (
            <Container key={idx}>
              <Text h4>Test Case {idx + 1}</Text>
              <Text>
                {t.userOutput} {t.passed ? '==' : '!='} {t.expectedOutput}
              </Text>
            </Container>
          ))}
      </Grid>
    </Grid.Container>
  );
};
