CREATE MIGRATION m15gii5qz4xep6u5t7f3vn2zdswbf73zame6ikdv6xald3qjmccj6a
    ONTO m1qtrqjqaeg2pdljvwi4w4fyjlbxcsscwtljsuvj7ewpdxhe4c2ina
{
  ALTER TYPE learning::QuestionFolder {
      CREATE MULTI LINK questions := (.<folder[IS learning::QuestionInstance]);
  };
  ALTER TYPE learning::QuestionInstance {
      ALTER LINK question {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE learning::QuestionInstance {
      CREATE MULTI LINK test_cases -> learning::TestCase {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE ALLOW;
      };
  };
};
