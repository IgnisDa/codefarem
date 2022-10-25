import { AccountType } from '@codefarem/generated/graphql/zeus';

export type AppUserData = {
  accountType: AccountType;
  profile: { email: string; username: string };
};
export type AppLoaderData = { userData: AppUserData };
export type User = { token: string; userDetails: AppUserData };
