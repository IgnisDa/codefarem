CREATE MIGRATION m1hf6ygliku542epnggawtktnw3j47u76zhg3bns5uxzvhv7ptvmaq
    ONTO m1pygfec2pg7xhnk3ppo37pcbxpyclo24cc7ofy2wppvg2qnavfbpa
{
  ALTER TYPE learning::Class {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
