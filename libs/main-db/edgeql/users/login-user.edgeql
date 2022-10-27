SELECT users::User {
  id,
  auth: {
    password_hash
  },
  __type__: {
    name
  }
}
FILTER .profile.email = <str>$0
