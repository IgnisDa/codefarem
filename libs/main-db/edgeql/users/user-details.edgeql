# get details of a user by their unique hanko_id
SELECT DISTINCT users::User {
  id,
  profile: {
    email,
    username,
    profile_avatar
  },
  account_type := .__type__.name
}
FILTER .auth.hanko_id = <str>$0;
