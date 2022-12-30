# delete a class by id
SELECT (
  DELETE learning::Class
  FILTER .id = <uuid>$0
) {
  id
}
