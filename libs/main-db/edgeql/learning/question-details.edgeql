SELECT learning::Question {
  created_at,
  name,
  problem,
  rendered_problem := '',
  num_classes := (SELECT count(.classes)),
  authored_by: {
    profile: {
      username
    }
  },
  test_cases: {
    id,
    inputs := (
      SELECT .inputs {
        data
      } ORDER BY .seq
    ),
    outputs := (
      SELECT .outputs {
        data
      } ORDER BY .seq
    )
  }
}
FILTER .slug = <str>$0
