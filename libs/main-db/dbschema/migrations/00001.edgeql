CREATE MIGRATION m1q3bfrf3okkn7uhsjpqqqgdtdjlshbdvekxhubkswmoeznodxntiq
    ONTO initial
{
  CREATE MODULE learning IF NOT EXISTS;
  CREATE MODULE users IF NOT EXISTS;
  CREATE TYPE learning::Class {
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE users::UserAuth {
      CREATE PROPERTY password_hash -> std::str;
  };
  CREATE TYPE users::UserProfile {
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY username -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE ABSTRACT TYPE users::User {
      CREATE REQUIRED LINK auth -> users::UserAuth {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK profile -> users::UserProfile {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  CREATE TYPE users::Student EXTENDING users::User;
  ALTER TYPE learning::Class {
      CREATE MULTI LINK students -> users::Student;
  };
  ALTER TYPE users::Student {
      CREATE MULTI LINK classes := (.<students[IS learning::Class]);
  };
  CREATE TYPE users::Teacher EXTENDING users::User;
  ALTER TYPE learning::Class {
      CREATE MULTI LINK teachers -> users::Teacher {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE users::Teacher {
      CREATE MULTI LINK classes := (.<teachers[IS learning::Class]);
  };
  CREATE ABSTRACT TYPE learning::TestCaseData {
      CREATE REQUIRED PROPERTY data -> std::str;
      CREATE REQUIRED PROPERTY seq -> std::int32;
  };
  CREATE TYPE learning::TestCase {
      CREATE MULTI LINK inputs -> learning::TestCaseData {
          ON SOURCE DELETE DELETE TARGET;
      };
      CREATE MULTI LINK outputs -> learning::TestCaseData {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
  CREATE TYPE learning::Question {
      CREATE MULTI LINK classes -> learning::Class;
      CREATE MULTI LINK authored_by -> users::User {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE ALLOW;
      };
      CREATE MULTI LINK test_cases -> learning::TestCase {
          ON SOURCE DELETE DELETE TARGET;
      };
      CREATE REQUIRED PROPERTY created_at -> std::datetime {
          SET default := (SELECT
              std::datetime_current()
          );
      };
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY problem -> std::str;
      CREATE REQUIRED PROPERTY slug -> std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::expression ON ((std::len(__subject__) >= 8));
      };
  };
};
