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
import { Form } from '@remix-run/react';
import { set } from 'lodash';
import { useState } from 'react';
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import { notFound } from 'remix-utils';
import { route } from 'routes-gen';
import { FAILURE_REDIRECT_PATH } from '~/lib/constants';
import { authenticator } from '~/lib/services/auth.server';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import {
  AccountType,
  SupportedLanguage,
} from ':generated/graphql/orchestrator/generated/graphql';
import type { CreateQuestionInput } from ':generated/graphql/orchestrator/generated/graphql';
import { getAuthHeader, gqlClient } from '~/lib/services/graphql.server';
import { CREATE_QUESTION } from ':generated/graphql/orchestrator/mutations';

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);
  if (user?.userDetails.accountType !== AccountType.Teacher)
    throw notFound({ message: 'Route not found' });
  return json({});
}

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
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
    getAuthHeader(user.token)
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
                        <Input
                          name={`testCases[${tIdx}].inputs[${iIdx}].data`}
                          type="text"
                          label="Data"
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
