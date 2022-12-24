use crate::learning::dto::queries::test_case::TestCaseUnit;
use async_graphql::{SimpleObject, Union};
use serde::Deserialize;
use utilities::graphql::ApiError;
use uuid::Uuid;

#[derive(SimpleObject, Deserialize)]
pub struct AuthoredByProfile {
    username: String,
}

#[derive(SimpleObject, Deserialize)]
pub struct AuthoredByInformation {
    profile: AuthoredByProfile,
}

#[derive(Debug, SimpleObject, Deserialize)]
pub struct TestCaseData {
    pub unit_type: TestCaseUnit,
    pub string_value: Option<String>,
    pub string_collection_value: Option<Vec<String>>,
    pub number_value: Option<f64>,
    pub number_collection_value: Option<Vec<f64>>,
}

#[derive(Debug, SimpleObject, Deserialize)]
pub struct QuestionData {
    /// The data related to this input
    pub data: TestCaseData,
}

#[derive(Debug, SimpleObject, Deserialize)]
pub struct QuestionTestCase {
    /// The unique ID for this test case
    id: Uuid,
    /// The ordered inputs for this test case
    pub inputs: Vec<QuestionData>,
    /// The ordered outputs for this test case
    pub outputs: Vec<QuestionData>,
}

/// The input object used to get details about a question
#[derive(SimpleObject, Deserialize)]
pub struct QuestionDetailsOutput {
    /// The name/title of the question
    pub name: String,

    /// The detailed markdown text explaining the question
    pub problem: String,

    /// The users who have created/edited this question
    pub authored_by: Vec<AuthoredByInformation>,

    /// All the test cases that are related to this question
    pub test_cases: Vec<QuestionTestCase>,
}

/// The output object when creating a new question
#[derive(Union)]
pub enum QuestionDetailsResultUnion {
    /// The type returned when getting details about a question was successful
    Result(QuestionDetailsOutput),

    /// The type returned when getting details about a question was unsuccessful
    Error(ApiError),
}
