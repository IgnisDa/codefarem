SELECT (
  INSERT learning::Question {
    name := <str>$0,
    problem := <str>$1,
    slug := <str>$2,
  }
  UNLESS CONFLICT ON .slug ELSE
  (
    UPDATE learning::Question SET {
      name := <str>$0,
      problem := <str>$1,
    }
  )
) {
  id,
  slug
}
