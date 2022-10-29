import { faker } from '@faker-js/faker';

// returns data for a new user
export const createUserInfo = () => ({
    auth: { password_hash: faker.internet.password()},
    profile: {
      email: faker.internet.email(),
      username: faker.internet.userName(),
    },
  });
