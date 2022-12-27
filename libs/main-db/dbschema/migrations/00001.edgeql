CREATE MIGRATION m1qtrqjqaeg2pdljvwi4w4fyjlbxcsscwtljsuvj7ewpdxhe4c2ina
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
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE users::UserAuth {
      CREATE REQUIRED PROPERTY hanko_id -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
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
  CREATE TYPE learning::QuestionFolder {
      CREATE REQUIRED LINK class -> learning::Class {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE LINK parent -> learning::QuestionFolder {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY name -> std::str;
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
  CREATE TYPE learning::QuestionInstance {
      CREATE REQUIRED LINK question -> learning::Question {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE ALLOW;
      };
      CREATE REQUIRED LINK folder -> learning::QuestionFolder {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
