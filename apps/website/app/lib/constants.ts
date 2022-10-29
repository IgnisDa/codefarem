import { $path } from 'remix-routes';

const APPLICATION_PREFIX = 'codefarem.application';

export const SESSION_KEY = `${APPLICATION_PREFIX}.session_key`;
export const FORM_EMAIL_KEY = 'email';
export const FORM_PASSWORD_KEY = 'password';
export const SUCCESSFUL_REDIRECT_PATH = $path('/');
export const FAILURE_REDIRECT_PATH = $path('/auth/login');
export const LOGOUT_PATH = $path('/auth/logout');
