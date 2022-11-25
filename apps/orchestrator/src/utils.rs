use crate::learning::dto::queries::{question_details::QuestionData, test_case::TestCaseUnit};

pub fn case_unit_to_argument(input_case_unit: &QuestionData) -> String {
    match input_case_unit.data.unit_type {
        TestCaseUnit::String => input_case_unit.data.string_value.clone().unwrap(),
        TestCaseUnit::StringCollection => input_case_unit
            .data
            .string_collection_value
            .clone()
            .unwrap()
            .join(","),
        TestCaseUnit::Number => input_case_unit.data.number_value.unwrap().to_string(),
        TestCaseUnit::NumberCollection => input_case_unit
            .data
            .number_collection_value
            .clone()
            .unwrap()
            .iter()
            .map(|f| f.to_string())
            .collect::<Vec<_>>()
            .join(","),
    }
}
