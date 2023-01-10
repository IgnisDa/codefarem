use async_graphql::{InputObject, Union};
use derive_getters::Getters;
use utilities::{
    graphql::{ApiError, RangeInput},
    models::IdObject,
};
use uuid::Uuid;

/// The input object when creating a goal
#[derive(Debug, InputObject, Getters)]
pub struct CreateGoalInput {
    /// The class to associated the goal with
    class_id: Uuid,
    /// The name of the goal
    name: String,
    /// The start and end date for this goal
    range: RangeInput,
    /// The color assigned to this goal
    color: String,
    /// The questions that are part of this goal
    question_ids: Vec<Uuid>,
}

/// The output object when creating a goal
#[derive(Union)]
pub enum CreateGoalResultUnion {
    /// The type returned if creating the goal was successful
    Result(IdObject),

    /// The type returned if creating the goal was unsuccessful
    Error(ApiError),
}
