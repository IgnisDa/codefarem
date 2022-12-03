SELECT users::User {
  profile: {
    email,
    username
  },
  account_type := .__type__.name
}
FILTER .auth.hanko_id = <str>$0;
