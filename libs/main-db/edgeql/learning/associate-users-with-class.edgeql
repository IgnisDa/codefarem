# associate students and teachers with a specific class
WITH
  class := assert_single(SELECT learning::Class FILTER .id = <uuid>$0)
UPDATE class
SET {
  teachers := {
    (SELECT users::Teacher FILTER .id in array_unpack(<array<uuid>>$1)),
    class.teachers
  },
  students := {
    (SELECT users::Student FILTER .id in array_unpack(<array<uuid>>$2)),
    class.students
  }
}
