// Fix for `cannot find module ':faker'`:
// https://github.com/facebook/jest/issues/11644#issuecomment-1171646729
import 'tsconfig-paths/register';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRandomWord } from ':faker';

// eslint-disable-next-line import/no-default-export
export default () => {
  const database = getRandomWord();
  process.env.EDGEDB_DATABASE = database;

  const directoryPath = join(
    // @ts-expect-error - This is needed to get the correct schema path
    dirname(dirname(fileURLToPath(import.meta.url))),
    'dbschema'
  );

  // first create the testing database using CLI and then apply the migrations
  execSync(
    `
edgedb database create ${database} --instance main_db
edgedb migration apply --schema-dir ${directoryPath} --database ${database} --instance main_db
`
  );
  return database;
};
