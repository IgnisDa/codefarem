SELECT User {
  id,
  auth: {
    password_hash
  }
}
FILTER .profile.email = <str>$0
