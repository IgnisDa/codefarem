import { faker } from '@faker-js/faker';

const FAKER_SEED = 420;

faker.seed(FAKER_SEED);

export const createUsername = () => faker.internet.userName();
export const createPassword = () => faker.internet.password();
export const createEmail = () => faker.internet.email();

// These functions always return static data. Useful in development when we do not need to
// type out the same data over and over again.
export const getFakeUsername = () => 'username-er-90';
export const getFakePassword = () => 'password1234567890';
export const getFakeEmail = () => 'username@email.com';

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

/**
 * Returns data about a new random user
 */
export const createUserInfo = () => ({
  auth: { password_hash: createPassword() },
  profile: { email: createEmail(), username: createUsername() },
});
