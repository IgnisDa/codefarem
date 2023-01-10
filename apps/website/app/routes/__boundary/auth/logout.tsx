import { redirect } from '@remix-run/node';
import { serialize } from 'cookie';
import { ApplicationConfig } from '~/lib/config.server';
import { FAILURE_REDIRECT_PATH } from '~/lib/constants';
import type { DataFunctionArgs } from '@remix-run/node';

export const loader = async (_args: DataFunctionArgs) => {
  const hankoCookie = serialize('hanko', '', {
    path: '/',
    domain: ApplicationConfig.COOKIE_DOMAIN,
    maxAge: -1,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });
  return redirect(FAILURE_REDIRECT_PATH, {
    headers: { 'Set-Cookie': hankoCookie }
  });
};
