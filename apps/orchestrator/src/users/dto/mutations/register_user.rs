use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use utilities::graphql::ApiError;
use uuid::Uuid;

/// The input object used to create a new user
#[derive(InputObject, Getters)]
pub struct RegisterUserInput {
    /// The username of the user
    username: String,

    /// The email of the user
    email: String,

    /// The ID issued by the hanko auth provider
    hanko_id: String,

    /// If this is defined, the account type will be set to the one defined in the invite,
    /// otherwise will be a normal student.
    invite_token: Option<String>,
}

/// The result type if the user was created successfully
#[derive(SimpleObject, Queryable)]
pub struct RegisterUserOutput {
    /// The ID of the user
    id: Uuid,
}

/// The output object when creating a new user
#[derive(Union)]
pub enum RegisterUserResultUnion {
    /// The type returned if creating a new user was successful
    Result(RegisterUserOutput),

    /// The type returned if creating a new user was unsuccessful
    Error(ApiError),
}
