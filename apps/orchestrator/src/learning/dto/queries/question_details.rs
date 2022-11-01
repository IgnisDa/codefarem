use async_graphql::{SimpleObject, Union};
use serde::Deserialize;
use utilities::graphql::ApiError;
use uuid::Uuid;

use super::test_case::TestCaseUnit;

#[derive(SimpleObject, Deserialize)]
pub struct AuthoredByProfile {
    username: String,
}

#[derive(SimpleObject, Deserialize)]
pub struct AuthoredByInformation {
    profile: AuthoredByProfile,
}

#[derive(SimpleObject, Deserialize)]
pub struct TestCaseData {
    unit_type: TestCaseUnit,
    string_value: Option<String>,
    string_collection_value: Option<Vec<String>>,
    number_value: Option<f64>,
    number_collection_value: Option<Vec<f64>>,
}

#[derive(SimpleObject, Deserialize)]
pub struct QuestionOutput {
    /// The data related to this output
    data: TestCaseData,
}

#[derive(SimpleObject, Deserialize)]
pub struct QuestionInput {
    /// The name of the variable
    name: String,
    /// The data related to this input
    data: TestCaseData,
}

#[derive(SimpleObject, Deserialize)]
pub struct QuestionTestCase {
    /// The unique ID for this test case
    id: Uuid,
    /// The ordered inputs for this test case
    inputs: Vec<QuestionInput>,
    /// The ordered outputs for this test case
    outputs: Vec<QuestionOutput>,
}

/// The input object used to get details about a question
#[derive(SimpleObject, Deserialize)]
pub struct QuestionDetailsOutput {
    /// The name/title of the question
    name: String,

    /// The detailed text explaining the question
    problem: String,

    /// The number of classes that have this question
    num_classes: u8,

    /// The users who have created/edited this question
    authored_by: Vec<AuthoredByInformation>,

    /// All the test cases that are related to this question
    test_cases: Vec<QuestionTestCase>,
}

/// The output object when creating a new question
#[derive(Union)]
pub enum QuestionDetailsResultUnion {
    /// The type returned when getting details about a question was successful
    Result(QuestionDetailsOutput),

    /// The type returned when getting details about a question was unsuccessful
    Error(ApiError),
}
