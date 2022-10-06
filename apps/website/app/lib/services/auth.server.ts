import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { FORM_EMAIL_KEY, FORM_PASSWORD_KEY } from '../constants';
import { getFetchOptions, graphqlSdk } from './graphql.server';
import { sessionStorage } from './session.server';

import type { User } from '../types';

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get(FORM_EMAIL_KEY) as string;
    const password = form.get(FORM_PASSWORD_KEY) as string;
    const { loginUser } = await graphqlSdk.LoginUser({
      input: { email, password },
    });
    if (loginUser.__typename === 'LoginUserError')
      throw new Error(`Invalid credentials provided`);
    const token = loginUser.token;
    const { userDetails } = await graphqlSdk.UserDetails(
      undefined,
      getFetchOptions(token)
    );
    return { token, userDetails } as User;
  })
);
