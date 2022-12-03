SELECT users::User {
  id,
  auth: {
    hanko_id
  },
  __type__: {
    name
  }
}
FILTER .auth.hanko_id = <str>$0
