import { redirect } from '@remix-run/server-runtime';
import { decode } from 'jsonwebtoken';

import { FAILURE_REDIRECT_PATH } from '../constants';
import { extractHankoCookie } from './graphql.server';

export type JwtPayload = { sub: string; exp: number; iat: number };

// Ensures the user has a hanko cookie and the cookie is not expired but does not verify
// the signature.
export async function requireValidJwt(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const hankoCookie = extractHankoCookie(request);
  const decoded = decode(hankoCookie) as JwtPayload;
  const hankoId = decoded?.sub;
  const exp = (decoded?.exp || 0) * 1000;
  if (!decoded || !hankoId || exp < Date.now()) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`${FAILURE_REDIRECT_PATH}?${searchParams}`);
  }
  return decoded;
}
