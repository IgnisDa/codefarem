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
        name,
        data: {
          [is learning::StringUnit].string_value,
          [is learning::StringCollectionUnit].string_collection_value,
          [is learning::NumberUnit].number_value,
          [is learning::NumberCollectionUnit].number_collection_value,
          unit_type := str_trim_start(.__type__.name, "learning::")
        }
      } ORDER BY .seq
    ),
    outputs := (
      SELECT .outputs {
        data: {
          [is learning::StringUnit].string_value,
          [is learning::StringCollectionUnit].string_collection_value,
          [is learning::NumberUnit].number_value,
          [is learning::NumberCollectionUnit].number_collection_value,
          unit_type := str_trim_start(.__type__.name, "learning::")
        }
      } ORDER BY .seq
    )
  }
}
FILTER .slug = <str>$0
