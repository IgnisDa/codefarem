use async_graphql::InputObject;
use utilities::graphql::RangeInput;
use uuid::Uuid;

#[derive(Debug, InputObject)]
pub struct GoalInput {
    /// The name of the goal
    pub name: String,
    /// The start and end date for this goal
    pub range: RangeInput,
    /// The color assigned to this goal
    pub color: String,
    /// The questions that are part of this goal
    pub question_instances: Vec<Uuid>,
}
