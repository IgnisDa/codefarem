CREATE MIGRATION m1s3r6ax6ba4rnbxtoj3a2m3qzp4cq7nzg7ricz3qjelve6bp7t3bq
    ONTO m1idlnujvr3kjsz57xr6n2drbtm5r6daoaqawmjzjwu5a7gwt4mtba
{
  ALTER TYPE users::UserAuth {
      DROP PROPERTY password_hash;
  };
};
