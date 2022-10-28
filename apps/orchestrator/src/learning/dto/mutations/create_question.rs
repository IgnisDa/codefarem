use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use utilities::graphql::ApiError;
use uuid::Uuid;

use crate::learning::dto::queries::test_case::TestCase;

/// The input object used to create a new question
#[derive(InputObject, Getters)]
pub struct CreateQuestionInput {
    /// The name/title of the question
    name: String,

    /// The detailed text explaining the question
    problem: String,

    /// The classes in which the question must be asked
    class_ids: Vec<Uuid>,

    /// All the test cases that are related to this question
    test_cases: Vec<TestCase>,
}

/// The result type if the question was created successfully
#[derive(SimpleObject, Queryable, Clone, Copy)]
pub struct CreateQuestionOutput {
    /// The ID of the question
    pub id: Uuid,
}

/// The output object when creating a new question
#[derive(Union)]
pub enum CreateQuestionResultUnion {
    /// The type returned if creating a new question was successful
    Result(CreateQuestionOutput),

    /// The type returned if creating a new question was unsuccessful
    Error(ApiError),
}