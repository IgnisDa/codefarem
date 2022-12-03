CREATE MIGRATION m1ruuzrjaqvvsuyvxbwg2fzzi7kgjfcfm7lanh3dnmsqevv2e2vl3a
    ONTO m1s3r6ax6ba4rnbxtoj3a2m3qzp4cq7nzg7ricz3qjelve6bp7t3bq
{
  ALTER TYPE users::User {
      DROP LINK auth;
  };
  DROP TYPE users::UserAuth;
};
