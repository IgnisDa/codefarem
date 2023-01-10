CREATE MIGRATION m1mxjzq62xpiix2afdn3a72s3h5v2xuhwmpshzvkfftglkhzf5pvya
    ONTO m12i22n5oh5ztykaxylgocsodbc27fy4bx2pkfpkf7xxqp6dl6smca
{
  ALTER TYPE users::UserAuth {
      CREATE LINK user := (.<auth[IS users::User]);
  };
  ALTER TYPE users::UserProfile {
      CREATE LINK user := (.<profile[IS users::User]);
  };
};
