import { AccountType } from '@codefarem/generated/graphql/generic-sdk';
import { Button, Input } from '@codefarem/react-ui';
import { RadioGroup } from '@headlessui/react';
import { json, redirect } from '@remix-run/node';
import { Form, useTransition } from '@remix-run/react';
import clsx from 'clsx';
import { match } from 'ts-pattern';

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
import { route } from 'routes-gen';

export const meta: MetaFunction = () => {
  return { title: 'Get started' };
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  let accountType = match(formData.get('accountType') as string)
    .with('teacher', () => AccountType.Teacher)
    .otherwise(() => AccountType.Student);
  const email = formData.get(FORM_EMAIL_KEY) as string;
  const password = formData.get(FORM_PASSWORD_KEY) as string;
  const username = new Date().toISOString();
  const { userWithEmail } = await graphqlSdk.UserWithEmail({
    input: { email },
  });
  if (userWithEmail.__typename === 'UserWithEmailError') {
    // user does not exist, we create one here
    const { registerUser } = await graphqlSdk.RegisterUser({
      input: { email, password, username, accountType },
    });
    if (registerUser.__typename === 'RegisterUserError')
      throw new Error(`There was a problem registering the user`);
  }
  return redirect(route('/auth/login'));
};

export const loader = async ({ request }: DataFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: SUCCESSFUL_REDIRECT_PATH,
  });
  return json({});
};

const accountTypes = ['student', 'teacher'];

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
          <RadioGroup
            name="accountType"
            defaultValue={accountTypes[0]}
            className="flex items-center space-x-6"
          >
            {accountTypes.map((accountType) => (
              <div key={accountType}>
                <RadioGroup.Option value={accountType}>
                  {({ checked }) => (
                    <div className="flex items-center space-x-2">
                      <div
                        className={clsx(
                          'w-4 h-4 bg-black rounded-full',
                          checked && '!bg-yellow-400'
                        )}
                      />
                      <RadioGroup.Label className="capitalize">
                        {accountType}
                      </RadioGroup.Label>
                    </div>
                  )}
                </RadioGroup.Option>
              </div>
            ))}
          </RadioGroup>
          <div className="w-full">
            <Button isLoading={transition.state !== 'idle'}>Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};