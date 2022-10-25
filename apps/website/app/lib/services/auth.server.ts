import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { FORM_EMAIL_KEY, FORM_PASSWORD_KEY } from '../constants';
import { graphqlSdk } from './graphql.server';
import { sessionStorage } from './session.server';

import type { User } from '../types';

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get(FORM_EMAIL_KEY) as string;
    const password = form.get(FORM_PASSWORD_KEY) as string;
    console.log({ email, password });
    const { loginUser } = await graphqlSdk()('query')({
      loginUser: [
        { input: { email, password } },
        {
          __typename: true,
          '...on LoginUserError': { __typename: true },
          '...on LoginUserOutput': { token: true },
        },
      ],
    });
    if (loginUser.__typename === 'LoginUserError')
      throw new Error(`Invalid credentials provided`);
    const token = loginUser.token;
    const { userDetails } = await graphqlSdk(token)('query')({
      userDetails: {
        __typename: true,
        '...on ApiError': { error: true },
        '...on UserDetailsOutput': {
          accountType: true,
          profile: { email: true, username: true },
        },
      },
    });
    return { token, userDetails } as User;
  })
);
