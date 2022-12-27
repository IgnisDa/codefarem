# get details about a class
SELECT learning::Class {
  name
}
FILTER .id=<uuid>$0;
