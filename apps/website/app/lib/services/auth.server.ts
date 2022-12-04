import { redirect } from '@remix-run/server-runtime';
import { decode } from 'jsonwebtoken';

import { FAILURE_REDIRECT_PATH } from '../constants';
import { extractHankoCookie } from './graphql.server';

export async function requireHankoId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
    const hankoCookie = extractHankoCookie(request);
    const decoded = decode(hankoCookie);
    const hankoId = decoded?.sub;
    if (!hankoId || typeof hankoId !== "string") {
        const searchParams = new URLSearchParams([
            ["redirectTo", redirectTo],
        ]);
        throw redirect(`${FAILURE_REDIRECT_PATH}?${searchParams}`);
    }
    return hankoId;
}
