import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRandomWord } from ':faker/index';

// eslint-disable-next-line import/no-default-export
export default () => {
  const database = getRandomWord();
  process.env.EDGEDB_DATABASE = database;

  const directoryPath = join(
    // @ts-expect-error - This is needed to get the correct schema path
    dirname(dirname(fileURLToPath(import.meta.url))),
    'dbschema'
  );

  // first create the testing database using CLI
  execSync(
    `
edgedb database create ${database} --instance main_db
edgedb migration apply --schema-dir ${directoryPath} --database ${database} --instance main_db
`
  );
};
