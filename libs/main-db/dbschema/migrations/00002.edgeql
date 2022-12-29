CREATE MIGRATION m1pygfec2pg7xhnk3ppo37pcbxpyclo24cc7ofy2wppvg2qnavfbpa
    ONTO m15m7qbpom52cmt46bwc4dcivvbgapucxma3c5zrttjfemfq3g7yga
{
  ALTER TYPE learning::Goal {
      CREATE REQUIRED PROPERTY start_date -> std::datetime {
          SET default := (SELECT
              std::datetime_current()
          );
      };
  };
};
