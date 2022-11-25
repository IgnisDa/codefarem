INSERT learning::TestCase {
    inputs := (
        SELECT learning::InputCaseUnit
        FILTER .id IN array_unpack(<array<uuid>>$0)
    ),
    outputs := (
        SELECT learning::OutputCaseUnit
        FILTER .id IN array_unpack(<array<uuid>>$1)
    ),
}
