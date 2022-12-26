use crate::learning::dto::queries::test_case::TestCase;
use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use utilities::graphql::ApiError;
use uuid::Uuid;

/// The input object used to upsert a question
#[derive(Debug, InputObject, Getters)]
pub struct UpsertQuestionInput {
    /// The name/title of the question
    name: String,

    /// The detailed text explaining the question
    problem: String,

    /// All the test cases that are related to this question
    test_cases: Vec<TestCase>,

    /// The unique slug of the question in case it is being updated
    update_slug: Option<String>,
}

/// The result type if the question was upsert-ed successfully
#[derive(Debug, SimpleObject, Queryable, Clone)]
pub struct UpsertQuestionOutput {
    /// The ID of the question
    pub id: Uuid,

    /// The slug of the upsert-ed question
    pub slug: String,
}

/// The output object when upsert-ing new question
#[derive(Union)]
pub enum UpsertQuestionResultUnion {
    /// The type returned if upsert-ing the question was successful
    Result(UpsertQuestionOutput),

    /// The type returned if upsert-ing the question was unsuccessful
    Error(ApiError),
}
