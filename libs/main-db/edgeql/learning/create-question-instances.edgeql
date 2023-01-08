WITH
  to_insert := <array<uuid>>$0
FOR item IN array_unpack(to_insert) union (
  INSERT learning::QuestionInstance {
    question := assert_single((
      SELECT learning::Question
      FILTER .id = item
    ))
  }
)
