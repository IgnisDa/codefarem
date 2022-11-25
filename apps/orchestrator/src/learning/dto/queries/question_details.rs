use async_graphql::{SimpleObject, Union};
use serde::Deserialize;
use utilities::graphql::ApiError;
use uuid::Uuid;

#[derive(Debug, SimpleObject, Deserialize)]
pub struct AuthoredByProfile {
    username: String,
}

#[derive(Debug, SimpleObject, Deserialize)]
pub struct AuthoredByInformation {
    profile: AuthoredByProfile,
}

#[derive(Debug, SimpleObject, Deserialize)]
pub struct TestCaseData {
    /// The actual data associated with the input/output
    pub data: String,
}

#[derive(Debug, SimpleObject, Deserialize)]
pub struct QuestionTestCase {
    /// The unique ID for this test case
    pub id: Uuid,
    /// The ordered inputs for this test case
    pub inputs: Vec<TestCaseData>,
    /// The ordered outputs for this test case
    pub outputs: Vec<TestCaseData>,
}

/// The input object used to get details about a question
#[derive(Debug, SimpleObject, Deserialize)]
pub struct QuestionDetailsOutput {
    /// The name/title of the question
    pub name: String,

    /// The detailed markdown text explaining the question
    pub problem: String,

    /// The html version of the problem that can be safely rendered
    pub rendered_problem: String,

    /// The number of classes that have this question
    pub num_classes: u8,

    /// The users who have created/edited this question
    pub authored_by: Vec<AuthoredByInformation>,

    /// All the test cases that are related to this question
    pub test_cases: Vec<QuestionTestCase>,
}

/// The output object when creating a new question
#[derive(Debug, Union)]
pub enum QuestionDetailsResultUnion {
    /// The type returned when getting details about a question was successful
    Result(QuestionDetailsOutput),

    /// The type returned when getting details about a question was unsuccessful
    Error(ApiError),
}
