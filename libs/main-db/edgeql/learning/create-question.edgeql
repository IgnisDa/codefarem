SELECT (
  INSERT learning::Question {
    name := <str>$0,
    problem := <str>$1,
    slug := <str>$2,
  }
) {
  id,
  slug
}
