INSERT learning::Goal {
  class := assert_single((SELECT learning::Class FILTER .id = <uuid>$0)),
  color := <str>$1,
  end_date := <datetime><str>$2,
  start_date := <datetime><str>$3,
  name := <str>$4,
  questions := (
    SELECT learning::QuestionInstance
    FILTER .id in array_unpack(<array<uuid>>$5)
  )
}
