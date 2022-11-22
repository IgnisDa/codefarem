import {
  fakeDataDevelopmentMode,
  getFakeEmail,
  getFakePassword,
} from ':faker/index';
import { Button, Card, Input, Loading, Spacer, Text } from '@nextui-org/react';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData, useTransition } from '@remix-run/react';
import { route } from 'routes-gen';
import { z } from 'zod';
import { zx } from 'zodix';
import {
  FAILURE_REDIRECT_PATH,
  FORM_EMAIL_KEY,
  FORM_PASSWORD_KEY,
  SUCCESSFUL_REDIRECT_PATH,
} from '~/lib/constants';
import { authenticator } from '~/lib/services/auth.server';
import { graphqlSdk } from '~/lib/services/graphql.server';
import { getSession } from '~/lib/services/session.server';

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
    return json(
      { message: `User does not exist. Please register first.` },
      { status: 400 }
    );
  return await authenticator.authenticate('form', request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
    failureRedirect: FAILURE_REDIRECT_PATH,
  });
};

export const loader = async ({ request }: DataFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
  });
  let session = await getSession(request.headers.get('cookie'));
  let errorMsg: { message: string } = session.get(
    authenticator.sessionErrorKey
  );
  return json({
    email: fakeDataDevelopmentMode(getFakeEmail),
    password: fakeDataDevelopmentMode(getFakePassword),
    error: errorMsg,
  });
};

export default () => {
  const { email, password, error } = useLoaderData<typeof loader>();
  const transition = useTransition();

  return (
    <Card>
      <Card.Header>
        <Text h2>Login</Text>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        {error && transition.state !== 'submitting' && (
          <Text color="error">{error.message}</Text>
        )}
        <Form method="post">
          <Input
            name={FORM_EMAIL_KEY}
            type="email"
            required
            placeholder="ana@skywalk.com"
            label="Email Address"
            width="100%"
            initialValue={email}
          />
          <Input.Password
            name={FORM_PASSWORD_KEY}
            required
            label="Password"
            width="100%"
            initialValue={password}
          />
          <Spacer y={1} />
          <Button
            type="submit"
            css={{ width: '100%' }}
            disabled={transition.state !== 'idle'}
          >
            {transition.state === 'idle' ? (
              'Submit'
            ) : (
              <Loading type="points" color="currentColor" />
            )}
          </Button>
        </Form>
      </Card.Body>
      <Card.Divider />
      <Card.Footer>
        <Text>
          Need to register? <Link to={route('/auth/register')}>Click here</Link>
        </Text>
      </Card.Footer>
    </Card>
  );
};
