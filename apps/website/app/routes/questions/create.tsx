import {
  AccountType,
  SupportedLanguage,
} from ':generated/graphql/orchestrator/generated/graphql';
import {
  CREATE_QUESTION,
  TEST_CASE_UNITS,
} from ':generated/graphql/orchestrator/mutations';
import { Container, Group, Stack, Text, TextInput } from '@mantine/core';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { set } from 'lodash';
import { useState } from 'react';
import { notFound } from 'remix-utils';
import { route } from 'routes-gen';
import { QuestionProblem } from '~/lib/components/QuestionProblem';
import { requireValidJwt } from '~/lib/services/auth.server';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import { getUserDetails } from '~/lib/services/user.server';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import type { CreateQuestionInput } from ':generated/graphql/orchestrator/generated/graphql';

export async function loader({ request }: LoaderArgs) {
  await requireValidJwt(request);
  const userDetails = await getUserDetails(request);
  if (userDetails.accountType !== AccountType.Teacher)
    throw notFound({ message: 'Route not found' });
  const { testCaseUnits } = await gqlClient.request(TEST_CASE_UNITS);
  return json({ testCaseUnits });
}

export async function action({ request }: ActionArgs) {
  let input: CreateQuestionInput = {} as any;
  for (const [key, value] of await request.formData()) set(input, key, value);

  // if there are no test cases at all
  if (!input.testCases?.length) input.testCases = [];

  // handle the case when input/output is empty for a test case
  input.testCases.forEach((tCase, idx, theArr) => {
    if (!tCase.inputs) theArr[idx].inputs = [];
    if (!tCase.outputs) theArr[idx].outputs = [];
  });

  input.classIds = [];
  const { createQuestion } = await gqlClient.request(
    CREATE_QUESTION,
    { input },
    authenticatedRequest(request)
  );
  if (createQuestion.__typename === 'ApiError')
    throw new Error(createQuestion.error);
  return redirect(
    route('/questions/solve/:slug/:lang', {
      slug: createQuestion.slug,
      lang: SupportedLanguage.Cpp,
    })
  );
}

export default () => {
  const { testCaseUnits } = useLoaderData<typeof loader>();
  // each element of this list denotes the number of [input, output] for a test case
  const [totalTestCases, setTotalTestCases] = useState([[1, 1]]);

  return (
    <Container w={'100%'} mx={{ xs: 10, md: 20 }}>
      <Stack>
        <TextInput label="Name" required />
        <div>
          <Text>Problem statement</Text>
          <QuestionProblem />
        </div>
      </Stack>
    </Container>
  );
};
