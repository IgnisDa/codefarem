SELECT User {
  profile: {
    email,
    username
  }
}
FILTER .id = <uuid>$0;
