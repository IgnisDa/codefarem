SELECT {
  username_not_unique := EXISTS (SELECT users::UserProfile FILTER .username = <str>$0),
  email_not_unique := EXISTS (SELECT users::UserProfile FILTER .email = <str>$1)
}
