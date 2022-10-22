SELECT users::User {
  profile: {
    email,
    username
  },
  account_type := .__type__.name
}
FILTER .id = <uuid>$0;
