CREATE MIGRATION m1djgowuchn7fap7ft4nsrehlmolcizyqidgkbvl5p3rebql524rpq
    ONTO initial
{
  CREATE MODULE external IF NOT EXISTS;
  CREATE MODULE learning IF NOT EXISTS;
  CREATE MODULE users IF NOT EXISTS;
  CREATE ABSTRACT TYPE learning::CaseUnit;
  CREATE TYPE learning::NumberCollectionUnit EXTENDING learning::CaseUnit {
      CREATE REQUIRED PROPERTY number_collection_value -> array<std::float64>;
  };
  CREATE SCALAR TYPE users::AccountType EXTENDING enum<Student, Teacher>;
  CREATE TYPE external::InviteLink {
      CREATE REQUIRED PROPERTY account_type -> users::AccountType {
          SET default := (users::AccountType.Teacher);
      };
      CREATE PROPERTY email -> std::str;
      CREATE REQUIRED PROPERTY expires_at -> std::datetime;
      CREATE PROPERTY used_at -> std::datetime;
      CREATE PROPERTY is_active := (((.expires_at > std::datetime_of_statement()) AND (.used_at ?= <std::datetime>{})));
      CREATE REQUIRED PROPERTY token -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE learning::NumberUnit EXTENDING learning::CaseUnit {
      CREATE REQUIRED PROPERTY number_value -> std::float64;
  };
  CREATE TYPE learning::StringCollectionUnit EXTENDING learning::CaseUnit {
      CREATE REQUIRED PROPERTY string_collection_value -> array<std::str>;
  };
  CREATE TYPE learning::StringUnit EXTENDING learning::CaseUnit {
      CREATE REQUIRED PROPERTY string_value -> std::str;
  };
  CREATE ABSTRACT TYPE learning::CommonCaseUnit {
      CREATE REQUIRED LINK data -> learning::CaseUnit {
          ON SOURCE DELETE DELETE TARGET;
      };
      CREATE PROPERTY normalized_data := (SELECT
          (std::array_join(.data[IS learning::StringCollectionUnit].string_collection_value, ',') IF (.data IS learning::StringCollectionUnit) ELSE (std::array_join(<array<std::str>>.data[IS learning::NumberCollectionUnit].number_collection_value, ',') IF (.data IS learning::NumberCollectionUnit) ELSE (<std::str>.data[IS learning::NumberUnit].number_value IF (.data IS learning::NumberUnit) ELSE .data[IS learning::StringUnit].string_value)))
      );
      CREATE REQUIRED PROPERTY seq -> std::int32;
  };
  CREATE TYPE learning::InputCaseUnit EXTENDING learning::CommonCaseUnit {
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE learning::OutputCaseUnit EXTENDING learning::CommonCaseUnit;
  CREATE TYPE learning::Class {
      CREATE REQUIRED PROPERTY join_slug -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE users::UserAuth {
      CREATE REQUIRED PROPERTY hanko_id -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE SCALAR TYPE users::Gender EXTENDING enum<Male, Female>;
  CREATE SCALAR TYPE users::Mood EXTENDING enum<Happy, Sad, Surprised>;
  CREATE TYPE users::UserProfile {
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY gender -> users::Gender;
      CREATE REQUIRED PROPERTY mood -> users::Mood;
      CREATE REQUIRED PROPERTY profile_avatar -> std::str;
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
      CREATE MULTI LINK students -> users::Student {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE users::Student {
      CREATE MULTI LINK classes := (.<students[IS learning::Class]);
  };
  CREATE TYPE users::Teacher EXTENDING users::User;
  ALTER TYPE learning::Class {
      CREATE MULTI LINK teachers -> users::Teacher {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE users::Teacher {
      CREATE MULTI LINK classes := (.<teachers[IS learning::Class]);
  };
  CREATE TYPE learning::Goal {
      CREATE REQUIRED LINK class -> learning::Class {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY color -> std::str {
          SET default := (SELECT
              std::assert_single((SELECT
                  {'826AED', 'C879FF', 'FFB7FF', '3BF4FB', 'CAFF8A'} ORDER BY
                      std::random() ASC
              LIMIT
                  1
              ))
          );
      };
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.name, .color, .class));
      CREATE REQUIRED PROPERTY end_date -> std::datetime {
          SET default := (SELECT
              (std::datetime_current() + <cal::relative_duration>'14 days')
          );
      };
      CREATE REQUIRED PROPERTY start_date -> std::datetime {
          SET default := (SELECT
              std::datetime_current()
          );
      };
  };
  CREATE TYPE learning::QuestionInstance;
  ALTER TYPE learning::Goal {
      CREATE REQUIRED MULTI LINK questions -> learning::QuestionInstance {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE ALLOW;
      };
  };
  CREATE TYPE learning::TestCase {
      CREATE MULTI LINK inputs -> learning::InputCaseUnit {
          ON SOURCE DELETE DELETE TARGET;
      };
      CREATE MULTI LINK outputs -> learning::OutputCaseUnit {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
  CREATE TYPE learning::Question {
      CREATE MULTI LINK test_cases -> learning::TestCase {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE ALLOW;
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
          CREATE CONSTRAINT std::expression ON ((std::len(__subject__) = 8));
      };
  };
  ALTER TYPE learning::TestCase {
      CREATE LINK question := (.<test_cases[IS learning::Question]);
  };
  ALTER TYPE learning::QuestionInstance {
      CREATE REQUIRED LINK question -> learning::Question {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
