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
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import { notFound } from 'remix-utils';
import { route } from 'routes-gen';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import {
  AccountType,
  SupportedLanguage,
  TestCaseUnit,
} from ':generated/graphql/orchestrator/generated/graphql';
import type { CreateQuestionInput } from ':generated/graphql/orchestrator/generated/graphql';
import { authenticatedRequest, gqlClient } from '~/lib/services/graphql.server';
import {
  CREATE_QUESTION,
  TEST_CASE_UNITS,
} from ':generated/graphql/orchestrator/mutations';
import { getUserDetails } from '~/lib/services/user.server';

export async function loader({ request }: LoaderArgs) {
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
    <Listbox name={name} defaultValue={TestCaseUnit.String}>
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
