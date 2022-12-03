import * as env from 'env-var';

const APPLICATION_API_URL = env
  .get('WEBSITE_APPLICATION_API_URL')
  .required()
  .asString();
const NODE_ENV = env.get('NODE_ENV').default('production').asString();
const SESSION_SECRET_KEY = env.get('WEBSITE_SESSION_SECRET_KEY').required().asString();
const HANKO_URL = env.get('WEBSITE_HANKO_URL').required().asUrlString().slice(0, -1);
const COOKIE_DOMAIN = env.get('WEBSITE_COOKIE_DOMAIN').required().asString()

export const ApplicationConfig = {
  APPLICATION_API_URL,
  SESSION_SECRET_KEY,
  NODE_ENV,
  HANKO_URL,
  COOKIE_DOMAIN
};
