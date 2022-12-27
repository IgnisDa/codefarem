# create a new class
INSERT learning::Class {
  name := <str>$0,
  teachers := (
    SELECT users::Teacher
    FILTER .id in array_unpack(<array<uuid>>$1)
  ),
  join_slug := <str>$2,
}
