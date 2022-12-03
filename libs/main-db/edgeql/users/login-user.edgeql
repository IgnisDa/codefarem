SELECT users::User {
  id,
  __type__: {
    name
  }
}
FILTER .profile.email = <str>$0
