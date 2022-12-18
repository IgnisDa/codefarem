SELECT learning::Question {
  id,
  created_time := <str>.created_at,
  name,
  slug,
  num_test_cases := (count(.test_cases)),
}
