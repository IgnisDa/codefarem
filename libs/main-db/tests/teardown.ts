import { execSync } from 'node:child_process';

// eslint-disable-next-line import/no-default-export
export default () => {
  const database = process.env.EDGEDB_DATABASE
  execSync(`edgedb query --instance main_db "DROP DATABASE ${database}"`);
};
