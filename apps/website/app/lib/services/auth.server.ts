import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { FORM_EMAIL_KEY, FORM_PASSWORD_KEY } from '../constants';
import { sessionStorage } from './session.server';
import type { User } from '~/lib/types';
import { getAuthHeader, gqlClient } from './graphql.server';
import {
  LOGIN_USER,
  USER_DETAILS,
} from ':generated/graphql/orchestrator/queries';
import { unauthorized } from 'remix-utils';

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }): Promise<User> => {
    const email = form.get(FORM_EMAIL_KEY) as string;
    const password = form.get(FORM_PASSWORD_KEY) as string;
    const { loginUser } = await gqlClient.request(LOGIN_USER, {
      input: { email, password },
    });
    if (loginUser.__typename === 'LoginUserError')
      throw unauthorized(`Invalid credentials provided`);
    const token = loginUser.token;
    const { userDetails } = await gqlClient.request(
      USER_DETAILS,
      undefined,
      getAuthHeader(token)
    );
    if (userDetails.__typename === 'ApiError')
      throw new Error(userDetails.error);
    return { token, userDetails };
  })
);
