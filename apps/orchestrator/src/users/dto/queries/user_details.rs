use async_graphql::{SimpleObject, Union};
use edgedb_derive::Queryable;
use utilities::graphql::ApiError;

#[derive(Debug, SimpleObject, Queryable)]
pub struct UserProfileInformation {
    /// The email of the user
    email: String,

    /// The username of the user
    username: String,
}

/// The result type if details about the user were found successfully
#[derive(Debug, SimpleObject, Queryable)]
pub struct UserDetailsOutput {
    /// Profile details about the user
    profile: UserProfileInformation,
}

/// The output object when creating a new user
#[derive(Union, Debug)]
pub enum UserDetailsResultUnion {
    /// The type returned if getting details about user was successful
    Result(UserDetailsOutput),

    /// The type returned if getting details about user was unsuccessful
    Error(ApiError),
}
