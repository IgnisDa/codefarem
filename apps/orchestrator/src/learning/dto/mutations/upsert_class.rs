use async_graphql::{InputObject, Union};
use derive_getters::Getters;
use utilities::{graphql::ApiError, models::IdObject};
use uuid::Uuid;

/// The input object used to create a new class
#[derive(InputObject, Getters)]
pub struct UpsertClassInput {
    /// The ID of the class. If this is present, then the class will be updated.
    join_slug: Option<String>,

    /// The name of the class
    name: String,

    /// The teachers who are teaching the class
    teacher_ids: Vec<Uuid>,

    /// The students who are in the class
    student_ids: Vec<Uuid>,
}

/// The output object when creating a new class
#[derive(Union)]
pub enum UpsertClassResultUnion {
    /// The type returned if creating a new class was successful
    Result(IdObject),

    /// The type returned if creating a new class was unsuccessful
    Error(ApiError),
}
