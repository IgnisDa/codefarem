use async_graphql::{SimpleObject, Union};
use edgedb_derive::Queryable;
use utilities::graphql::ApiError;

/// The result type if details about the class were found successfully
#[derive(Debug, SimpleObject, Queryable)]
pub struct ClassDetailsOutput {
    /// The name of the class
    name: String,
    /// The number of goals in the class
    num_goals: i64,
    /// The number of students in the class
    num_students: i64,
    /// The number of teachers in the class
    num_teachers: i64,
}

/// The output object when getting details about a class
#[derive(Union, Debug)]
pub enum ClassDetailsResultUnion {
    /// The type returned if getting details about the class was successful
    Result(ClassDetailsOutput),

    /// The type returned if getting details about the class was unsuccessful
    Error(ApiError),
}
