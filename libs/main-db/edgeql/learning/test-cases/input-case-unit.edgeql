INSERT learning::InputCaseUnit {
    name := <str>$0,
    seq := <int32>$1,
    data := (
        SELECT learning::CaseUnit
        FILTER .id = <uuid>$2
    )
};
