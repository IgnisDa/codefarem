import { createCookieSessionStorage } from '@remix-run/node';
import { DateTime } from 'luxon';

import { ApplicationConfig } from '../config.server';
import { SESSION_KEY } from '../constants';

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: SESSION_KEY, // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [ApplicationConfig.SESSION_SECRET_KEY],
    secure: ApplicationConfig.NODE_ENV === 'production', // enable this in prod only
    expires: DateTime.local().plus({ days: 60 }).toJSDate(),
  },
});

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage;
