INSERT learning::TestCase {
    inputs := (
        SELECT learning::TestCaseData
        FILTER .id IN array_unpack(<array<uuid>>$0)
    ),
    outputs := (
        SELECT learning::TestCaseData
        FILTER .id IN array_unpack(<array<uuid>>$1)
    ),
}
