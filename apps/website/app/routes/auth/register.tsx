import { Button, Input } from '@codefarem/react-ui';
import { json, redirect } from '@remix-run/node';
import { Form, useTransition } from '@remix-run/react';
import { $path } from 'remix-routes';
import { z } from 'zod';
import { zx } from 'zodix';
import { AccountType } from '@codefarem/generated/orchestrator-graphql';

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
    const { registerUser } = await graphqlSdk()('mutation')({
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
          '...on RegisterUserError': { __typename: true },
          '...on RegisterUserOutput': { __typename: true },
        },
      ],
    });
    if (registerUser.__typename === 'RegisterUserError')
      throw new Error(`There was a problem registering the user`);
  }
  return redirect($path('/auth/login'));
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
    <div className="flex-auto md:max-w-lg">
      <div className="space-y-4">
        <h1 className="w-full text-2xl font-semibold font-circular-book text-primary-heading">
          Register
        </h1>
        <h2 className="text-lg font-circular-book text-grayed">
          Please provide the following details
        </h2>
      </div>
      <div className="mt-10">
        <Form className="flex flex-col mb-10 space-y-2" method="post">
          <Input
            name={FORM_EMAIL_KEY}
            type="email"
            required
            placeholder="ana@skywalk.com"
            label="Email Address"
          />
          <Input
            name={FORM_PASSWORD_KEY}
            type="password"
            required
            label="Password"
          />
          <div className="w-full">
            <Button isLoading={transition.state !== 'idle'}>Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
