use async_graphql::Union;
use utilities::graphql::{ApiError, UserDetailsOutput};

/// The output object when creating a new user
#[derive(Union, Debug)]
pub enum UserDetailsResultUnion {
    /// The type returned if getting details about user was successful
    Result(UserDetailsOutput),

    /// The type returned if getting details about user was unsuccessful
    Error(ApiError),
}
