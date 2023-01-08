# search all users by their username, and group them by their account type
GROUP (
  SELECT users::User {
    id,
    profile: {
      email,
      username,
      profile_avatar
    },
  }
  FILTER
    .profile.username ILIKE '%' ++ <str>$0 ++ '%'
)
USING
  account_type := .__type__.name
BY
  account_type
