import * as env from 'env-var';

const APPLICATION_API_URL = env
  .get('WEBSITE_APPLICATION_API_URL')
  .required()
  .asString();
const NODE_ENV = env.get('NODE_ENV').default('production').asString();
const SESSION_SECRET_KEY = env.get('WEBSITE_SESSION_SECRET_KEY').required().asString();

export const ApplicationConfig = {
  APPLICATION_API_URL,
  SESSION_SECRET_KEY,
  NODE_ENV,
};
