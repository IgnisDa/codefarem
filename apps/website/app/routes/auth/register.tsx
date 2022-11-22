import {
  fakeDataDevelopmentMode,
  getFakeEmail,
  getFakePassword,
} from ':faker/index';
import { AccountType } from ':generated/graphql/orchestrator';
import { Button, Card, Input, Loading, Spacer, Text } from '@nextui-org/react';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
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
  return { title: 'Register' };
};

export const action = async ({ request }: ActionArgs) => {
  const { email, password } = await zx.parseForm(request, {
    [FORM_EMAIL_KEY]: z.string().email(),
    [FORM_PASSWORD_KEY]: z.string().min(8),
  });
  const username = new Date().toISOString();
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
  if (userWithEmail.__typename === 'UserWithEmailError') {
    // user does not exist, we create one here
    await graphqlSdk()('mutation')({
      registerUser: [
        {
          input: {
            email,
            password,
            username,
            accountType: AccountType.STUDENT,
          },
        },
        {
          __typename: true,
          '...on RegisterUserError': { emailNotUnique: true },
          '...on RegisterUserOutput': { __typename: true },
        },
      ],
    });
    return redirect(route('/auth/login'));
  }
  return json(
    { message: 'The email you entered was not unique' },
    { status: 400 }
  );
};

export const loader = async ({ request }: DataFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
  });
  return json({
    email: fakeDataDevelopmentMode(getFakeEmail),
    password: fakeDataDevelopmentMode(getFakePassword),
  });
};

export default () => {
  const { email, password } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const transition = useTransition();

  return (
    <Card>
      <Card.Header>
        <Text h2>Register</Text>
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
          Need to login? <Link to={route('/auth/login')}>Click here</Link>
        </Text>
      </Card.Footer>
    </Card>
  );
};
