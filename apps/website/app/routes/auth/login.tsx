import {
  Button,
  Container,
  Input,
  Loading,
  Row,
  Text,
} from '@nextui-org/react';
import { json } from '@remix-run/node';
import { Form, useTransition } from '@remix-run/react';
import { z } from 'zod';
import { zx } from 'zodix';
import {
  FORM_EMAIL_KEY,
  FORM_PASSWORD_KEY,
  SUCCESSFUL_REDIRECT_PATH,
} from '~/lib/constants';
import { authenticator } from '~/lib/services/auth.server';
import { graphqlSdk } from '~/lib/services/graphql.server';

import type {
  ActionArgs,
  DataFunctionArgs,
  MetaFunction,
} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return { title: 'Login' };
};

export const action = async ({ request }: ActionArgs) => {
  const { email } = await zx.parseForm(request.clone(), {
    [FORM_EMAIL_KEY]: z.string().email(),
  });
  const { userWithEmail } = await graphqlSdk()('query')({
    userWithEmail: [
      { input: { email } },
      {
        __typename: true,
        '...on UserWithEmailOutput': { __typename: true },
        '...on UserWithEmailError': { __typename: true },
      },
    ],
  });
  if (userWithEmail.__typename === 'UserWithEmailError')
    throw new Error(`User does not exist. Please register first.`);
  await authenticator.authenticate('form', request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
    context: { formData: request.clone().formData() },
  });
};

export const loader = async ({ request }: DataFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
  });
  return json({});
};

export default () => {
  const transition = useTransition();

  return (
    <>
      <Container gap={0}>
        <Text h1>Login</Text>
      </Container>
      <Form method="post">
        <Container gap={0}>
          <Row gap={0}>
            <Input
              name={FORM_EMAIL_KEY}
              type="email"
              required
              placeholder="ana@skywalk.com"
              label="Email Address"
              width="100%"
            />
          </Row>
          <Row gap={0}>
            <Input
              name={FORM_PASSWORD_KEY}
              type="password"
              required
              label="Password"
              width="100%"
            />
          </Row>
          <Row gap={0}>
            <Button type="submit">
              {transition.state !== 'idle' && <Loading />}
              Submit
            </Button>
          </Row>
        </Container>
      </Form>
    </>
  );
};
