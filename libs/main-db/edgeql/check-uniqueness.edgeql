SELECT {
  username_not_unique := EXISTS (SELECT UserProfile FILTER .username = <str>$0),
  email_not_unique := EXISTS (SELECT UserProfile FILTER .email = <str>$1)
}
