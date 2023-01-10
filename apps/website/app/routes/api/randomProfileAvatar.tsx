import { RANDOM_PROFILE_AVATAR } from ':graphql/orchestrator/queries';
import { json } from '@remix-run/server-runtime';
import { gqlClient } from '~/lib/services/graphql.server';

export const loader = async () => {
  const { randomProfileAvatar } = await gqlClient.request(
    RANDOM_PROFILE_AVATAR
  );
  return json({ randomProfileAvatar });
};
