SELECT (
  EXISTS (
    SELECT learning::Question FILTER .slug = <str>$0
  )
)
