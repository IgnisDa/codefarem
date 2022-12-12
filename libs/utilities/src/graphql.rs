use crate::users::AccountType;
use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};

/// An error type with an attached field to tell what went wrong
#[derive(Debug, Default, Deserialize, Serialize, SimpleObject)]
pub struct ApiError {
    /// The error describing what went wrong
    pub error: String,
}

#[derive(Debug, SimpleObject, Deserialize, Clone)]
pub struct UserProfileInformation {
    /// The email of the user
    email: String,

    /// The username of the user
    username: String,
}

/// The result type if details about the user were found successfully
#[derive(Debug, SimpleObject, Deserialize, Clone)]
pub struct UserDetailsOutput {
    /// Profile details about the user
    profile: UserProfileInformation,

    /// The type of account the user has
    account_type: AccountType,
}
