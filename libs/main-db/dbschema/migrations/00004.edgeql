CREATE MIGRATION m1i6jvjv2msfjmaeo34e7zlzfi6obwwlx2tvdqzwnzdb3dnxtb2b5q
    ONTO m1k4xqoozr4f5otzzvjuw6ilckfmkg23pqaw5olfqpyojwejwjljsa
{
  CREATE MODULE learning IF NOT EXISTS;
  CREATE MODULE users IF NOT EXISTS;
  ALTER TYPE default::Student {
      DROP LINK classes;
  };
  ALTER TYPE default::Teacher {
      DROP LINK classes;
  };
  ALTER TYPE default::Class RENAME TO learning::Class;
  ALTER TYPE default::User RENAME TO users::User;
  ALTER TYPE default::Student RENAME TO users::Student;
  ALTER TYPE default::Teacher RENAME TO users::Teacher;
  ALTER TYPE default::UserAuth RENAME TO users::UserAuth;
  ALTER TYPE default::UserProfile RENAME TO users::UserProfile;
  ALTER TYPE users::Student {
      CREATE MULTI LINK classes := (.<students[IS learning::Class]);
  };
  ALTER TYPE users::Teacher {
      CREATE MULTI LINK classes := (.<teachers[IS learning::Class]);
  };
};
