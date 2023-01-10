CREATE MIGRATION m12i22n5oh5ztykaxylgocsodbc27fy4bx2pkfpkf7xxqp6dl6smca
    ONTO m1djgowuchn7fap7ft4nsrehlmolcizyqidgkbvl5p3rebql524rpq
{
  ALTER TYPE users::UserProfile {
      DROP PROPERTY gender;
      DROP PROPERTY mood;
  };
};
