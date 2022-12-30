use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use utilities::models::IdObject;

/// The input object used to query for a user
#[derive(InputObject, Getters)]
pub struct UserWithEmailInput {
    /// The email of the user
    email: String,
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
    Result(IdObject),

    /// The type returned if a user with the provided email was not found
    Error(UserWithEmailError),
}
