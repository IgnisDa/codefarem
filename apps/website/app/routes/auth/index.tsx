import { Button, Input } from '@codefarem/react-ui';
import { json } from '@remix-run/node';
import { Form } from '@remix-run/react';

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

export const meta: MetaFunction = () => {
  return { title: 'Get started' };
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get(FORM_EMAIL_KEY) as string;
  const password = formData.get(FORM_PASSWORD_KEY) as string;
  const username = new Date().toDateString();
  const { userWithEmail } = await graphqlSdk.UserWithEmail({
    input: { email },
  });
  if (userWithEmail.__typename === 'UserWithEmailError') {
    // user does not exist, we create one here
    const { registerUser } = await graphqlSdk.RegisterUser({
      input: { email, password, username },
    });
    if (registerUser.__typename === 'RegisterUserError')
      throw new Error(`There was a problem registering the user`);
  }
  await authenticator.authenticate('form', request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
    context: { formData },
  });
};

export const loader = async ({ request }: DataFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
  });
  return json({});
};

export default () => {
  return (
    <div className="flex-auto md:max-w-lg">
      <div className="space-y-4">
        <h1 className="w-full text-2xl font-semibold font-circular-book text-primary-heading">
          Get started
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
            <Button>Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
