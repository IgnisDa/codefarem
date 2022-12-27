# check if a question with the given slug exists
SELECT (
  EXISTS (
    SELECT learning::Question FILTER .slug = <str>$0
  )
)
