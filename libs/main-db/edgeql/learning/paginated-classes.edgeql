WITH
  selected := (
    SELECT learning::Class
    FILTER
      (.id > <optional uuid>$0) ?? true
      AND
      (.id < <optional uuid>$1) ?? true
    ORDER BY .id {{DIRECTION}}
    LIMIT <optional int16>$2
  ),
  min_id := (SELECT min(selected.id)),
  max_id := (SELECT max(selected.id)),
SELECT {
  selected := (
    SELECT selected {
        id,
        name,
        join_slug,
        num_teachers := (count(.teachers)),
        num_students := (count(.students)),
    }
    ORDER BY .id
  ),
  has_previous_page := (EXISTS (
    SELECT learning::Class
    FILTER .id < min_id
  )),
  has_next_page := (EXISTS (
    SELECT learning::Class
    FILTER .id > max_id
  ))
}
