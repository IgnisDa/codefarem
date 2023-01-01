WITH
  n_username := <optional str>$1,
  n_profile_avatar := <optional str>$2
UPDATE users::UserProfile
FILTER .user.auth.hanko_id = <str>$0
SET {
  username := n_username ?? .username,
  profile_avatar := n_profile_avatar ?? .profile_avatar
}
