import { route } from 'routes-gen';

const APPLICATION_PREFIX = 'codefarem.application';

export const SESSION_KEY = `${APPLICATION_PREFIX}.session_key`;
export const FORM_EMAIL_KEY = 'email';
export const FORM_PASSWORD_KEY = 'password';
export const SUCCESSFUL_REDIRECT_PATH = route('/');
export const FAILURE_REDIRECT_PATH = route('/auth');
export const LOGOUT_PATH = route('/auth/logout');
