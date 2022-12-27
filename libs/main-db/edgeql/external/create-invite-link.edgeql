# create a new invite link
SELECT (
  INSERT external::InviteLink {
    email := <optional str>$0,
    expires_at := <datetime><str>$1,
    account_type := <users::AccountType><str>$2,
    token := <str>$3
  }
) {
  token
}
