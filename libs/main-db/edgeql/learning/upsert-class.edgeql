# upsert a class and associate students and teachers with it
WITH class := (
  INSERT learning::Class {
    name := <str>$0,
    join_slug := <str>$1
  }
  UNLESS CONFLICT ON .join_slug ELSE (
    UPDATE learning::Class
    SET { name := <str>$0 }
  )
)
SELECT (
  UPDATE class
  SET {
    teachers := (
      SELECT users::Teacher
      FILTER .id in array_unpack(<array<uuid>>$2)
    ),
    students := (
      SELECT users::Student
      FILTER .id in array_unpack(<array<uuid>>$3)
    ),
  }
)
