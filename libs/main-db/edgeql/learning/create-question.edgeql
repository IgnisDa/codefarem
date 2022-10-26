INSERT learning::Question {
  name := <str>$0,
  problem := <str>$1,
  slug := <str>$2,
  classes := (
    SELECT learning::Class
    FILTER .id in array_unpack(<array<uuid>>$3)
  ),
  authored_by := (
    SELECT users::Teacher
    FILTER .id in array_unpack(<array<uuid>>$4)
  )
}
