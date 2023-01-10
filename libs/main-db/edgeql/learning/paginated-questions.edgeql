# a query to get a list of classes, which supports forward and backward pagination
WITH
  selected := (
    SELECT learning::Question
    FILTER
      (.id > <optional uuid>$0) ?? true # forward pagination
      AND
      (.id < <optional uuid>$1) ?? true # backward pagination
    # We need to ORDER BY ASC if `first` is specified and DESC if `last` is specified
    ORDER BY .id {{DIRECTION}} # FIXME: We will have to use a hard replace, would be better if we could use parameters
    LIMIT <optional int16>$2
  ),
  min_id := (SELECT min(selected.id)),
  max_id := (SELECT max(selected.id)),
SELECT {
  selected := (
    SELECT selected {
        id,
        created_time := <str>.created_at, # use datetime that is supported by edgedb
        name,
        slug,
        num_test_cases := (count(.test_cases)),
    }
    ORDER BY .id
  ),
  has_previous_page := (EXISTS (
    SELECT learning::Question
    FILTER .id < min_id
  )),
  has_next_page := (EXISTS (
    SELECT learning::Question
    FILTER .id > max_id
  ))
}
