CREATE MIGRATION m1fphkeoeewdurxghxa7ref3ggdwoe2dndrdnauxpb6j2i4i4v67uq
    ONTO m1xied67czarelpodrqtdaqfqalcqobflnjjnaczmd2gijc7ndjlsq
{
  CREATE MODULE organizations IF NOT EXISTS;
  CREATE TYPE organizations::Organization {
      CREATE MULTI LINK members -> users::Teacher {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE ALLOW;
          CREATE PROPERTY since -> std::datetime;
      };
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE organizations::InviteLink {
      CREATE REQUIRED LINK organization -> organizations::Organization {
          ON SOURCE DELETE ALLOW;
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY email -> std::str;
      CREATE REQUIRED PROPERTY expires_at -> std::datetime;
      CREATE REQUIRED PROPERTY is_used -> std::bool {
          SET default := false;
      };
      CREATE PROPERTY is_active := (((.expires_at > std::datetime_of_statement()) AND NOT (.is_used)));
      CREATE REQUIRED PROPERTY token -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
