# get a user's profile by their email
SELECT users::UserProfile.<profile[is users::User] {
  id
}
FILTER .profile.email = <str>$0
