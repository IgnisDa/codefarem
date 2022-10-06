SELECT UserProfile.<profile[is User] {
  id
}
FILTER .profile.email = <str>$0
