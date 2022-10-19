SELECT (
  INSERT users::{User} {
    profile := (INSERT users::UserProfile {
      username := <str>$0,
      email := <str>$1,
    }),
    auth := (INSERT users::UserAuth {
      password_hash := <str>$2
    })
  }
)
