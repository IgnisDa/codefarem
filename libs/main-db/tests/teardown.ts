import { execSync } from 'node:child_process';

export default async () => {
  const database = globalThis.DATABASE_NAME;
  execSync(`edgedb query --instance main_db "DROP DATABASE ${database}"`);
};
