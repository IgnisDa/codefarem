import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { faker } from '@faker-js/faker';

// eslint-disable-next-line import/no-default-export
export default () => {
  const database = faker.lorem.word();
  process.env.EDGEDB_DATABASE = database;

  // @ts-expect-error - This is needed to get the correct schema path
  const directoryPath = join(dirname(dirname(fileURLToPath(import.meta.url))), 'dbschema');

  // first create the testing database using CLI
  execSync(
`
edgedb database create ${database} --instance main_db
edgedb migration apply --schema-dir ${directoryPath} --database ${database} --instance main_db
`
  );
};
