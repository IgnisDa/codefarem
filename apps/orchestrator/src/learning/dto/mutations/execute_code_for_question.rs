use crate::farem::dto::mutations::execute_code::{
    ExecuteCodeError, ExecuteCodeInput, ExecuteCodeTime,
};
use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use utilities::graphql::ApiError;

/// The input object used to execute some code
#[derive(InputObject, Getters)]
pub struct ExecuteCodeForQuestionInput {
    /// The unique ID of the question for which test cases need to be tested
    question_slug: String,

    /// The code input that needs to be compiled
    execute_input: ExecuteCodeInput,
}

/// The result type if a test case was executed successfully. Does not imply that the test
/// case passed, just that the code was executed successfully.
#[derive(Debug, SimpleObject)]
pub struct TestCaseSuccessStatus {
    /// Whether the test case passed or not
    pub passed: bool,

    /// The output of the user's code
    pub user_output: String,

    /// The expected output as defined in the test case
    pub expected_output: String,

    /// The time taken for the various steps
    pub time: ExecuteCodeTime,

    /// The diff between the user's output and the expected output
    pub diff: String,
}

#[derive(Debug, Union)]
pub enum TestCaseResultUnion {
    /// The type returned if executing code was successful
    Result(TestCaseSuccessStatus),

    /// The type returned if executing code was unsuccessful
    Error(ExecuteCodeError),
}

/// The result type if the code was compiled and executed successfully
#[derive(Debug, SimpleObject)]
pub struct ExecuteCodeForQuestionOutput {
    /// The total number of test cases
    pub num_test_cases: u8,

    /// The number of test cases that failed
    pub num_test_cases_failed: u8,

    /// Data about individual test cases
    pub test_case_statuses: Vec<TestCaseResultUnion>,
}

/// The output object when executing code
#[derive(Debug, Union)]
pub enum ExecuteCodeForQuestionResultUnion {
    /// The type returned if executing code was successful
    Result(ExecuteCodeForQuestionOutput),

    /// The type returned if executing code was unsuccessful
    Error(ApiError),
}
