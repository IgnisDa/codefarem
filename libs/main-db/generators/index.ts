import { faker } from '@faker-js/faker';

// returns data for a new user
export const createUserInfo = () => {
  return {
    profile: {
      email: faker.internet.email(),
      username: faker.internet.userName(),
    },
    auth: {
      password_hash: faker.internet.password(),
    },
  };
};
