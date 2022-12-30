use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use utilities::graphql::ApiError;
use uuid::Uuid;

/// The input object used to create a new class
#[derive(InputObject, Getters)]
pub struct UpsertClassInput {
    /// The name of the class
    name: String,

    /// The teachers who are teaching the class
    teacher_ids: Vec<Uuid>,

    /// The students who are in the class
    student_ids: Vec<Uuid>,
}

/// The result type if the class was created successfully
#[derive(SimpleObject, Queryable)]
pub struct UpsertClassOutput {
    /// The ID of the class
    id: Uuid,
}

/// The output object when creating a new class
#[derive(Union)]
pub enum UpsertClassResultUnion {
    /// The type returned if creating a new class was successful
    Result(UpsertClassOutput),

    /// The type returned if creating a new class was unsuccessful
    Error(ApiError),
}
