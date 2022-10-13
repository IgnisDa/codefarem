CREATE MIGRATION m1eqdazjkhl5ipjpwo4nl32jliaa6aasws7tsbijslrmwd4sdzdoja
    ONTO m1avtrger3yzmvnbv2eam2rk7zm3dxki4q2snbeulipjuzrx32roma
{
  # custom
  DELETE default::User; # because users might already exist

  ALTER TYPE default::User SET ABSTRACT;
  CREATE TYPE default::Student EXTENDING default::User;
  CREATE TYPE default::Teacher EXTENDING default::User;
  CREATE TYPE default::Class {
      CREATE MULTI LINK students -> default::Student;
      CREATE REQUIRED MULTI LINK teachers -> default::Teacher {
          ON TARGET DELETE ALLOW;
      };
      CREATE REQUIRED PROPERTY name -> std::str;
  };
};
