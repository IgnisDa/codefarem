SELECT external::InviteLink {
  id,
  is_active,
  email,
  expires_at,
  role := (SELECT 'users::' ++ <str>.account_type)
}
FILTER .token = <str>$0
