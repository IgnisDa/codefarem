# associate students and teachers with a specific class
UPDATE learning::Class
FILTER .id = <uuid>$0
SET {
  teachers := (
    SELECT users::Teacher
    FILTER .id in array_unpack(<array<uuid>>$1)
  ),
  students := (
    SELECT users::Student
    FILTER .id in array_unpack(<array<uuid>>$2)
  )
}
