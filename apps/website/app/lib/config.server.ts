import * as env from 'env-var';

const APPLICATION_API_URL = env
  .get('APPLICATION_API_URL')
  .required()
  .asString();
const NODE_ENV = env.get('NODE_ENV').default('production').asString();

export const ApplicationConfig = {
  APPLICATION_API_URL,
  NODE_ENV,
};
