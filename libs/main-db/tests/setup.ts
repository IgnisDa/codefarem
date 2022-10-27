import { faker } from '@faker-js/faker';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';

export default async () => {
  const database = faker.lorem.word();
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
