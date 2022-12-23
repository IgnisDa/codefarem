WITH
  selected := (
    SELECT learning::Question
    FILTER
      (.id > <optional uuid>$0) ?? true # forward pagination
      AND
      (.id < <optional uuid>$1) ?? true # backward pagination
    ORDER BY .id
    LIMIT <int16>$2
  ),
  min_id := (SELECT min(selected.id)),
  max_id := (SELECT max(selected.id)),
SELECT {
  selected := selected {
      id,
      created_time := <str>.created_at, # use datetime that is supported by edgedb
      name,
      slug,
      num_test_cases := (count(.test_cases)),
  },
  has_previous_page := (EXISTS (
    SELECT learning::Question
    FILTER .id < min_id
  )),
  has_next_page := (EXISTS (
    SELECT learning::Question
    FILTER .id > max_id
  ))
}
