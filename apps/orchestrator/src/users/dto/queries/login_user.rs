use async_graphql::{Enum, InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;

/// The input object used to create a new user
#[derive(InputObject, Getters)]
pub struct LoginUserInput {
    /// The ID issued by the hanko auth provider
    hanko_id: String,
}

/// The result type if the user was created successfully
#[derive(SimpleObject, Queryable)]
pub struct LoginUserOutput {
    /// The unique JWT token to be issued
    pub token: String,
}

/// The different errors that can occur when logging in to the service
#[derive(Copy, Clone, Debug, PartialEq, Eq, Enum)]
pub enum LoginError {
    /// The credentials did not match
    CredentialsMismatch,
}

/// The result type if an error was encountered when creating a new user
#[derive(Debug, SimpleObject)]
pub struct LoginUserError {
    /// The error encountered while logging in
    pub error: LoginError,
}

/// The output object when creating a new user
#[derive(Union)]
pub enum LoginUserResultUnion {
    /// The type returned if creating a new user was successful
    Result(LoginUserOutput),

    /// The type returned if creating a new user was unsuccessful
    Error(LoginUserError),
}
