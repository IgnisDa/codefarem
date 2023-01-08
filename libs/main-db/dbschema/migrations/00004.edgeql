CREATE MIGRATION m15wnxc4egm5wpq46zjulkxesgkj7gt7wti64kgizbhjh5ullna53q
    ONTO m1mxjzq62xpiix2afdn3a72s3h5v2xuhwmpshzvkfftglkhzf5pvya
{
  ALTER TYPE learning::Class {
      CREATE MULTI LINK goals := (.<class[IS learning::Goal]);
  };
};
