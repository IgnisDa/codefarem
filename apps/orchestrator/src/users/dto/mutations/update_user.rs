use async_graphql::{InputObject, Union};
use derive_getters::Getters;
use utilities::{graphql::ApiError, models::IdObject};

/// The input object used to update a user
#[derive(InputObject, Getters)]
pub struct UpdateUserInput {
    /// The username of the user
    username: Option<String>,

    /// The profile avatar of the user
    profile_avatar: Option<String>,
}

/// The output object when creating a new user
#[derive(Union)]
pub enum UpdateUserResultUnion {
    /// The type returned if updating the user was successful
    Result(IdObject),

    /// The type returned if updating the user was unsuccessful
    Error(ApiError),
}
