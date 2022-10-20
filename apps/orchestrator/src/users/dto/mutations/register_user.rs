use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::common::users::AccountType;

/// The input object used to create a new user
#[derive(InputObject, Getters)]
pub struct RegisterUserInput {
    /// The username of the user
    username: String,

    /// The email of the user
    email: String,

    /// The password that the user wants to set
    #[graphql(secret)]
    password: String,

    /// The type of account the user wants to create
    account_type: AccountType,
}

/// The result type if the user was created successfully
#[derive(SimpleObject, Queryable)]
pub struct RegisterUserOutput {
    /// The ID of the user
    id: Uuid,
}

/// The result type if an error was encountered when creating a new user
#[derive(Debug, Default, Deserialize, Eq, PartialEq, Serialize, SimpleObject, Queryable)]
pub struct RegisterUserError {
    /// whether the provided username is unique
    pub username_not_unique: bool,

    /// whether the provided email is unique
    pub email_not_unique: bool,
}

/// The output object when creating a new user
#[derive(Union)]
pub enum RegisterUserResultUnion {
    /// The type returned if creating a new user was successful
    Result(RegisterUserOutput),

    /// The type returned if creating a new user was unsuccessful
    Error(RegisterUserError),
}
