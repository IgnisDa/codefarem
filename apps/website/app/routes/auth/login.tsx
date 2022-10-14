import { Button, Input } from '@codefarem/react-ui';
import { json } from '@remix-run/node';
import { Form, useTransition } from '@remix-run/react';

import {
  FORM_EMAIL_KEY,
  FORM_PASSWORD_KEY,
  SUCCESSFUL_REDIRECT_PATH,
} from '../../lib/constants';
import { authenticator } from '../../lib/services/auth.server';
import { graphqlSdk } from '../../lib/services/graphql.server';

import type {
  ActionArgs,
  DataFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { z } from 'zod';
import { zx } from 'zodix';

export const meta: MetaFunction = () => {
  return { title: 'Login' };
};

export const action = async ({ request }: ActionArgs) => {
  const { email } = await zx.parseForm(request.clone(), {
    [FORM_EMAIL_KEY]: z.string().email(),
  });
  const { userWithEmail } = await graphqlSdk.UserWithEmail({
    input: { email },
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
    <div className="flex-auto md:max-w-lg">
      <div className="space-y-4">
        <h1 className="w-full text-2xl font-semibold font-circular-book text-primary-heading">
          Login
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
