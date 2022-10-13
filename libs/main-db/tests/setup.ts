import { faker } from '@faker-js/faker';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';

export default async () => {
  if (!process.env.TESTING_EDGEDB_DSN)
    throw new Error('`TESTING_EDGEDB_DSN` is not set');
  process.env.EDGEDB_DSN = process.env.TESTING_EDGEDB_DSN;

  const database = faker.word.noun();
  globalThis.DATABASE_NAME = database;
  process.env.EDGEDB_DATABASE = database;

  const directoryPath = join(dirname(dirname(__filename)), 'dbschema');

  // first create the testing database using CLI
  execSync(
    `
edgedb database create ${database} --instance main_db
edgedb migration apply --schema-dir ${directoryPath} --database ${database} --instance main_db
`
  );
};
