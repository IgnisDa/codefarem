CREATE MIGRATION m15dfmemd3qyhyui5vbk752wq56p2iotapewvxqm6huw2hrebhrlqa
    ONTO m1i6jvjv2msfjmaeo34e7zlzfi6obwwlx2tvdqzwnzdb3dnxtb2b5q
{
  CREATE MODULE utilities IF NOT EXISTS;
  CREATE ABSTRACT TYPE learning::CaseUnit;
  CREATE TYPE learning::NumberCollectionUnit EXTENDING learning::CaseUnit {
      CREATE REQUIRED PROPERTY value -> array<std::float64>;
  };
  CREATE FUNCTION utilities::slugify(text: std::str) ->  std::str USING (SELECT
      std::str_lower(std::re_replace('[^a-zA-Z0-9]', '-', text, flags := 'gi'))
  );
  CREATE TYPE learning::NumberUnit EXTENDING learning::CaseUnit {
      CREATE REQUIRED PROPERTY value -> std::float64;
  };
  CREATE TYPE learning::StringCollectionUnit EXTENDING learning::CaseUnit {
      CREATE REQUIRED PROPERTY value -> array<std::str>;
  };
  CREATE TYPE learning::StringUnit EXTENDING learning::CaseUnit {
      CREATE REQUIRED PROPERTY value -> std::str;
  };
  CREATE TYPE learning::InputCaseUnit {
      CREATE REQUIRED LINK data -> learning::CaseUnit;
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE learning::OutputCaseUnit {
      CREATE REQUIRED LINK data -> learning::CaseUnit;
  };
  ALTER TYPE learning::Class {
      ALTER LINK teachers {
          RESET OPTIONALITY;
      };
  };
  CREATE SCALAR TYPE learning::CaseUnitSequence EXTENDING std::sequence;
  CREATE TYPE learning::TestCase {
      CREATE MULTI LINK input -> learning::InputCaseUnit {
          CREATE PROPERTY order -> learning::CaseUnitSequence;
      };
      CREATE REQUIRED MULTI LINK output -> learning::OutputCaseUnit {
          CREATE PROPERTY order -> learning::CaseUnitSequence;
      };
  };
  CREATE TYPE learning::Question {
      CREATE MULTI LINK authored_by -> users::User {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE ALLOW;
      };
      CREATE MULTI LINK class -> learning::Class;
      CREATE MULTI LINK test_cases -> learning::TestCase;
      CREATE REQUIRED PROPERTY created_at -> std::datetime {
          SET default := (SELECT
              std::datetime_current()
          );
      };
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY slug -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY text -> std::str;
  };
};
