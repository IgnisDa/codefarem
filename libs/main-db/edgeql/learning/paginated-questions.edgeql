SELECT learning::Question {
  id,
  created_time := <str>.created_at, # use datetime that is supported by edgedb
  name,
  slug,
  num_test_cases := (count(.test_cases)),
}
FILTER  (.id > <uuid><optional str>$0) ?? true
ORDER BY .created_at
LIMIT <int16>$1
