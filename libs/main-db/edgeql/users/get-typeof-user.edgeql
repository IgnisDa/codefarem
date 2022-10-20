WITH user := (
  SELECT users::User
  FILTER .id = <uuid>$0
)
SELECT user.__type__.name;
