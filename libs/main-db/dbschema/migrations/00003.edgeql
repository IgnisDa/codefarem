CREATE MIGRATION m1fzzoaapgp6vmafrqcdu2cb6z2zqysuihht3ygr2wkayumywgv4za
    ONTO m1m5yzfkyldh5hn4k2u6prusha2agehv2pf3qdwgpzoolpjvyq6cga
{
  ALTER TYPE learning::Question {
      ALTER LINK test_cases {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE learning::TestCase {
      CREATE LINK question := (.<test_cases[IS learning::Question]);
  };
};
