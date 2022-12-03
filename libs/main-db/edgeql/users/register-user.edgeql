SELECT (
  INSERT users::{User} {
    profile := (INSERT users::UserProfile {
      username := <str>$0,
      email := <str>$1,
    })
  }
)
