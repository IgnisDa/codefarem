# create a new user, with the required account type
SELECT (
  INSERT users::{User} {
    profile := (INSERT users::UserProfile {
      username := <str>$0,
      email := <str>$1,
      mood := <str>$2,
      gender := <str>$3,
      profile_avatar := <str>$4,
    }),
    auth := (INSERT users::UserAuth {
      hanko_id := <str>$5,
    }),
  }
)
