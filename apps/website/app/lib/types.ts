import type { UserDetailsOutput } from '@codefarem/generated/graphql/generic-sdk';

export type AppUserData = UserDetailsOutput;
export type AppLoaderData = { userData: AppUserData };
export type User = { token: string; userDetails: AppUserData };
