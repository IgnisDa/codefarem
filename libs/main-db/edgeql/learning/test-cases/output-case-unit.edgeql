# create a new output case unit
INSERT learning::OutputCaseUnit {
    seq := <int32>$0,
    data := (
        SELECT learning::CaseUnit
        FILTER .id = <uuid>$1
    )
};
