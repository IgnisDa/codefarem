# search all the questions by name or problem or slug
WITH
  query := '%' ++ <str>$0 ++ '%',
  results := (
    SELECT learning::Question
    FILTER
      .name ILIKE query OR
      .problem ILIKE query OR
      .slug ILIKE query
    ORDER BY .name
  )
SELECT {
  results := results {
      id,
      created_time := (<str>.created_at),
      name,
      slug,
      num_test_cases := count(.test_cases)
  },
  total := count(results)
}
