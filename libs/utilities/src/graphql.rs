use crate::users::AccountType;
use async_graphql::{InputObject, SimpleObject};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// An error type with an attached field to tell what went wrong.
#[derive(Debug, Default, Deserialize, Serialize, SimpleObject)]
pub struct ApiError {
    /// The error describing what went wrong
    pub error: String,
}

/// The details of a user's profile.
#[derive(Debug, SimpleObject, Deserialize, Clone)]
pub struct UserProfileInformation {
    /// The email of the user
    pub email: String,
    /// The username of the user
    pub username: String,
}

/// The result type if details about the user were found successfully.
#[derive(Debug, SimpleObject, Deserialize, Clone)]
pub struct UserDetailsOutput {
    /// The unique ID of the user
    pub id: Uuid,
    /// Profile details about the user
    pub profile: UserProfileInformation,
    /// The type of account the user has
    pub account_type: AccountType,
}

/// The arguments for connection connection parameters.
#[derive(Debug, Deserialize, Clone, InputObject)]
pub struct ConnectionArguments {
    pub after: Option<String>,
    pub before: Option<String>,
    pub first: Option<i32>,
    pub last: Option<i32>,
}
