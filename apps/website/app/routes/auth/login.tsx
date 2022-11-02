import { Button, Card, Input, Loading, Spacer, Text } from '@nextui-org/react';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useTransition } from '@remix-run/react';
import { route } from 'routes-gen';
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
    return json(
      { message: `User does not exist. Please register first.` },
      { status: 400 }
    );
  try {
    await authenticator.authenticate('form', request, {
      successRedirect: SUCCESSFUL_REDIRECT_PATH,
      context: { formData: request.clone().formData() },
    });
    return json({ message: '' });
  } catch {
    return json(
      {
        message: 'Either email or password was not correct.',
      },
      { status: 400 }
    );
  }
};

export const loader = async ({ request }: DataFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
  });
  return json({});
};

export default () => {
  const actionData = useActionData<typeof action>();
  const transition = useTransition();

  return (
    <Card>
      <Card.Header>
        <Text h2>Login</Text>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        {actionData && <Text color="error">{actionData.message}</Text>}
        <Form method="post">
          <Input
            name={FORM_EMAIL_KEY}
            type="email"
            required
            placeholder="ana@skywalk.com"
            label="Email Address"
            width="100%"
          />
          <Input.Password
            name={FORM_PASSWORD_KEY}
            required
            label="Password"
            width="100%"
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
