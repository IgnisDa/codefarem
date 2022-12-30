use async_graphql::{InputObject, Union};
use derive_getters::Getters;
use utilities::{graphql::ApiError, models::IdObject};

/// The input object used to delete a question
#[derive(Debug, InputObject, Getters)]
pub struct DeleteQuestionInput {
    /// The unique slug of the question that needs to be deleted
    question_slug: String,
}

/// The output object when deleting question
#[derive(Union)]
pub enum DeleteQuestionResultUnion {
    /// The type returned if deleting the question was successful
    Result(IdObject),

    /// The type returned if deleting the question was unsuccessful
    Error(ApiError),
}
