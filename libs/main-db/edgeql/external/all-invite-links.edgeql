SELECT external::InviteLink {
  id,
  token,
  is_active,
  email,
  expires_at,
  used_at,
  role := (SELECT 'users::' ++ <str>.account_type)
}
