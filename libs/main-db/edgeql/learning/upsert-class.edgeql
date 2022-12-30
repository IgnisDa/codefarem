# upsert a class
INSERT learning::Class {
  name := <str>$0,
  join_slug := <str>$1
}
UNLESS CONFLICT ON .join_slug ELSE (
  UPDATE learning::Class
  SET {
    name := <str>$0
  }
)
