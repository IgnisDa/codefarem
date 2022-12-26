import type { LoaderArgs } from '@remix-run/server-runtime';

export const loader = async (_args: LoaderArgs) => {};

export default () => {
  return <div>ID</div>;
};
