use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use utilities::graphql::ApiError;
use uuid::Uuid;

/// The input object used to delete a question
#[derive(Debug, InputObject, Getters)]
pub struct DeleteQuestionInput {
    /// The unique slug of the question that needs to be deleted
    question_slug: String,
}

/// The result type if the question was deleted successfully
#[derive(Debug, SimpleObject, Queryable, Clone)]
pub struct DeleteQuestionOutput {
    /// The ID of the question
    pub id: Uuid,
}

/// The output object when deleting question
#[derive(Union)]
pub enum DeleteQuestionResultUnion {
    /// The type returned if deleting the question was successful
    Result(DeleteQuestionOutput),

    /// The type returned if deleting the question was unsuccessful
    Error(ApiError),
}
