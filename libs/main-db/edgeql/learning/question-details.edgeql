# get details about a particular question
SELECT learning::Question {
  created_at,
  name,
  problem,
  test_cases: {
    id,
    inputs := (
      SELECT .inputs {
        name,
        normalized_data,
        unit_type := str_trim_start(.data.__type__.name, "learning::")
      } ORDER BY .seq
    ),
    outputs := (
      SELECT .outputs {
        normalized_data,
        unit_type := str_trim_start(.data.__type__.name, "learning::")
      } ORDER BY .seq
    )
  }
}
FILTER .slug = <str>$0
