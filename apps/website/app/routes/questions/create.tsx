import type { ResolverInputTypes } from ':generated/graphql/orchestrator';
import { AccountType, TestCaseUnit } from ':generated/graphql/orchestrator';
import { Listbox } from '@headlessui/react';
import { v4 as uuid4 } from 'uuid';
import {
  Button,
  Col,
  Container,
  Grid,
  Input,
  Row,
  Text,
  Textarea,
} from '@nextui-org/react';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { capitalCase } from 'change-case';
import { set } from 'lodash';
import { useState } from 'react';
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import { notFound } from 'remix-utils';
import { route } from 'routes-gen';
import { FAILURE_REDIRECT_PATH } from '~/lib/constants';
import { authenticator } from '~/lib/services/auth.server';
import { graphqlScalars, graphqlSdk } from '~/lib/services/graphql.server';

import type { ActionArgs, LoaderArgs } from '@remix-run/node';

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);
  if (user?.userDetails.accountType !== AccountType.TEACHER)
    throw notFound({ message: 'Route not found' });
  const { testCaseUnits } = await graphqlSdk()('query')({
    testCaseUnits: true,
  });
  return json({ testCaseUnits });
}

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
  let input: ResolverInputTypes['CreateQuestionInput'] = {} as any;
  for (const [key, value] of await request.formData()) set(input, key, value);

  // if there are no test cases at all
  if (!input.testCases?.length) input.testCases = [];

  // handle the case when input/output is empty for a test case
  input.testCases.forEach((tCase, idx, theArr) => {
    if (!tCase.inputs) theArr[idx].inputs = [];
    if (!tCase.outputs) theArr[idx].outputs = [];
  });

  // TODO: Allow to add multiple classes Also, there is a problem with the graphql scalar library
  // where it is unable to parse empty arrays of custom scalars.
  input.classIds = [uuid4()];
  const { createQuestion } = await graphqlSdk(user.token)('mutation', {
    scalars: graphqlScalars,
  })({
    createQuestion: [
      { input: input },
      {
        '...on ApiError': { error: true },
        '...on CreateQuestionOutput': { slug: true },
        __typename: true,
      },
    ],
  });
  if (createQuestion.__typename === 'ApiError')
    throw new Error(createQuestion.error);
  return redirect(
    route('/questions/solve/:slug', { slug: createQuestion.slug })
  );
}

const SelectUnitCase = ({
  name,
  heading,
  testCaseUnits,
}: {
  name: string;
  heading: string;
  testCaseUnits: TestCaseUnit[];
}) => {
  return (
    <Listbox name={name} defaultValue={TestCaseUnit.STRING}>
      {({ value }) => (
        <>
          <Text>{heading}</Text>
          {/* TODO: use select from Next-UI once it has been released */}
          <Listbox.Button>{capitalCase(value)}</Listbox.Button>
          <Listbox.Options>
            {testCaseUnits.map((unit, idx) => (
              <Listbox.Option key={idx} value={unit}>
                {capitalCase(unit)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </>
      )}
    </Listbox>
  );
};

export default () => {
  const { testCaseUnits } = useLoaderData<typeof loader>();
  // each element of this list denotes the number of [input, output] for a test case
  const [totalTestCases, setTotalTestCases] = useState([[1, 1]]);

  return (
    <div>
      <h1>Create Question</h1>
      <Form method="post">
        <Input name="name" type="text" required labelPlaceholder="Name" />
        <Textarea
          name="problem"
          labelPlaceholder="Accompanying text"
          placeholder="You can use github flavored markdown"
          required
        />
        <div>
          <Text h2>Test Cases</Text>
          <Button
            rounded
            ghost
            icon={<HiPlusCircle size={30} />}
            onClick={() => setTotalTestCases([...totalTestCases, [1, 1]])}
          >
            Add test case
          </Button>
          <Grid.Container gap={2}>
            {totalTestCases.map((testCases, tIdx) => (
              <Grid key={tIdx}>
                <Container>
                  <Text h4>Input</Text>
                  <HiPlusCircle
                    size={30}
                    onClick={() => {
                      const newTestCases = [...totalTestCases];
                      newTestCases[tIdx][0]++;
                      setTotalTestCases(newTestCases);
                    }}
                  />
                  {[...Array(testCases[0]).keys()].map((iIdx) => (
                    <Row align="center" key={iIdx}>
                      <Col>
                        <SelectUnitCase
                          name={`testCases[${tIdx}].inputs[${iIdx}].dataType`}
                          heading="Type"
                          testCaseUnits={testCaseUnits}
                        />
                      </Col>
                      <Col>
                        <Input
                          name={`testCases[${tIdx}].inputs[${iIdx}].data`}
                          type="text"
                          label="Data"
                        />
                        <input
                          name={`testCases[${tIdx}].inputs[${iIdx}].name`}
                          type="text"
                          defaultValue={`line${iIdx + 1}`}
                          hidden
                        />
                      </Col>
                      <Col>
                        <HiMinusCircle
                          size={30}
                          onClick={() => {
                            const newTestCases = [...totalTestCases];
                            newTestCases[tIdx][0]--;
                            setTotalTestCases(newTestCases);
                          }}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Text h4>Output</Text>
                  <HiPlusCircle
                    size={30}
                    onClick={() => {
                      const newTestCases = [...totalTestCases];
                      newTestCases[tIdx][1]++;
                      setTotalTestCases(newTestCases);
                    }}
                  />
                  {[...Array(testCases[1]).keys()].map((oIdx) => (
                    <Row align="center" key={oIdx}>
                      <Col>
                        <SelectUnitCase
                          name={`testCases[${tIdx}].outputs[${oIdx}].dataType`}
                          heading="Type"
                          testCaseUnits={testCaseUnits}
                        />
                      </Col>
                      <Col>
                        <Input
                          name={`testCases[${tIdx}].outputs[${oIdx}].data`}
                          type="text"
                          label="Data"
                        />
                      </Col>
                      <Col>
                        <HiMinusCircle
                          size={30}
                          onClick={() => {
                            const newTestCases = [...totalTestCases];
                            newTestCases[tIdx][1]--;
                            setTotalTestCases(newTestCases);
                          }}
                        />
                      </Col>
                    </Row>
                  ))}
                </Container>
              </Grid>
            ))}
          </Grid.Container>
        </div>
        <div>
          <Button type="submit">Create Question</Button>
        </div>
      </Form>
    </div>
  );
};
