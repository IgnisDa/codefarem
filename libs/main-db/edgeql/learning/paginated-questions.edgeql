SELECT learning::Question {
  id,
  created_time := <str>.created_at, # use datetime that is supported by edgedb
  name,
  slug,
  num_test_cases := (count(.test_cases)),
}
FILTER
  (.id > <optional uuid>$0) ?? true # forward pagination
  AND
  (.id < <optional uuid>$1) ?? true # backward pagination
ORDER BY .created_at
LIMIT <int16>$2
