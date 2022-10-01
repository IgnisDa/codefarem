CREATE MIGRATION m1avtrger3yzmvnbv2eam2rk7zm3dxki4q2snbeulipjuzrx32roma
    ONTO initial
{
  CREATE TYPE default::UserAuth {
      CREATE PROPERTY password_hash -> std::str;
  };
  CREATE TYPE default::UserProfile {
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY username -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::User {
      CREATE REQUIRED LINK auth -> default::UserAuth {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK profile -> default::UserProfile {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
