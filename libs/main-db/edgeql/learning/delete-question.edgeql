SELECT (
  DELETE learning::Question
  FILTER .slug = <str>$0
) {
  id
}
