use rocket::{
    async_trait,
    request::{FromRequest, Outcome},
    Request,
};

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

#[derive(Debug)]
pub struct RequestData {
    pub user_token: Option<String>,
}

pub struct Token(pub Option<String>);

#[async_trait]
impl<'r> FromRequest<'r> for Token {
    type Error = String;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let token_str = request
            .headers()
            .get_one("authorization")
            .map(|f| f.to_string());
        let token = Token(token_str);
        Outcome::Success(token)
    }
}
