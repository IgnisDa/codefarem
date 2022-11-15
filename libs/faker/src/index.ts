import { faker } from '@faker-js/faker';

/**
 * Returns data about a new random user
 */
export const createUserInfo = () => ({
  auth: { password_hash: faker.internet.password() },
  profile: {
    email: faker.internet.email(),
    username: faker.internet.userName(),
  },
});

/**
 * Returns a random word
 */
export const getRandomWord = () => faker.random.word();

/**
 * Generates fake data only in development mode using the given function.
 */
export const fakeDataDevelopmentMode = <T>(fn: () => T): T | undefined => {
  if (process.env.NODE_ENV === 'development') return fn();
  return undefined;
};
