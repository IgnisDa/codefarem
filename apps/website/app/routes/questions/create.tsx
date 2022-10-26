import { AccountType, TestCaseUnit } from '@codefarem/generated/graphql/zeus';
import { Listbox } from '@headlessui/react';
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
import { HiPlusCircle } from 'react-icons/hi';
import { notFound } from 'remix-utils';
import { route } from 'routes-gen';

import { FAILURE_REDIRECT_PATH } from '../../lib/constants';
import { authenticator } from '../../lib/services/auth.server';
import { graphqlSdk } from '../../lib/services/graphql.server';

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
  const input: any = {};
  for (const [key, value] of await request.formData()) {
    set(input, key, value);
  }
  input.classIds = [];
  const { createQuestion } = await graphqlSdk(user.token)('mutation')({
    createQuestion: [
      { input: input },
      {
        '...on ApiError': { error: true },
        '...on CreateQuestionOutput': { id: true },
        __typename: true,
      },
    ],
  });
  if (createQuestion.__typename === 'ApiError')
    throw new Error(createQuestion.error);
  return redirect(route('/questions/:id', { id: createQuestion.id }));
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
    <div className="max-w-md">
      <h1 className="text-2xl">Create Question</h1>
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
                    </Row>
                  ))}
                </Container>
              </Grid>
            ))}
          </Grid.Container>
        </div>
        <div className="w-full">
          <Button type="submit">Create Class</Button>
        </div>
      </Form>
    </div>
  );
};
