# set an invite link as used
UPDATE external::InviteLink
FILTER .id = <uuid>$0
SET {
  used_at := <datetime><str>$1
}
