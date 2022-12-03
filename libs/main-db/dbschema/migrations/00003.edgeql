CREATE MIGRATION m1xied67czarelpodrqtdaqfqalcqobflnjjnaczmd2gijc7ndjlsq
    ONTO m1idlnujvr3kjsz57xr6n2drbtm5r6daoaqawmjzjwu5a7gwt4mtba
{
  ALTER TYPE users::UserAuth {
      CREATE REQUIRED PROPERTY hanko_id -> std::str {
          SET REQUIRED USING (SELECT
              ''
          );
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE users::UserAuth {
      DROP PROPERTY password_hash;
  };
};
