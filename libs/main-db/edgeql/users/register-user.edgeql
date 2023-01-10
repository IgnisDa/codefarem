# create a new user, with the required account type
SELECT (
  INSERT users::{User} {
    profile := (INSERT users::UserProfile {
      username := <str>$0,
      email := <str>$1,
      profile_avatar := <str>$2,
    }),
    auth := (INSERT users::UserAuth {
      hanko_id := <str>$3,
    }),
  }
)
