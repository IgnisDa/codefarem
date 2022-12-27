# create a new class
INSERT learning::Class {
  name := <str>$0,
  join_slug := <str>$1,
  teachers := (
    SELECT users::Teacher
    FILTER .id in array_unpack(<array<uuid>>$2)
  ),
  students := (
    SELECT users::Student
    FILTER .id in array_unpack(<array<uuid>>$3)
  ),
}
