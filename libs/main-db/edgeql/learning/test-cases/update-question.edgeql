UPDATE learning::Question
FILTER .id = <uuid>$0
SET {
    test_cases := (
        SELECT learning::TestCase
        FILTER .id IN array_unpack(<array<uuid>>$1)
    )
}
