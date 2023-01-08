# get details about a class
SELECT learning::Class {
  id,
  name,
  num_goals := count(.goals),
  num_students := count(.students),
  num_teachers := count(.teachers)
}
FILTER .join_slug=<str>$0;
