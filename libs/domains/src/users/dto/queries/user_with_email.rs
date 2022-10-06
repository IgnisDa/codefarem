use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use uuid::Uuid;

/// The input object used to query for a user
#[derive(InputObject, Getters)]
pub struct UserWithEmailInput {
    /// The email of the user
    email: String,
}

/// The result type if the user was created successfully
#[derive(SimpleObject, Queryable, Clone)]
pub struct UserWithEmailOutput {
    /// The unique ID of the user
    pub id: Uuid,
}

/// The result type if a user with the provided email was not found
#[derive(Debug, SimpleObject)]
pub struct UserWithEmailError {
    /// The error encountered while finding the user
    pub error: String,
}

/// The output object when finding a user with the provided email
#[derive(Union)]
pub enum UserWithEmailResultUnion {
    /// The type returned if a user with the provided email was found
    Result(UserWithEmailOutput),

    /// The type returned if a user with the provided email was not found
    Error(UserWithEmailError),
}
