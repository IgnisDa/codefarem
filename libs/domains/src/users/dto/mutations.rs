use async_graphql::{InputObject, SimpleObject};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use uuid::Uuid;

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
}

/// The output object when creating a new user
#[derive(SimpleObject, Queryable)]
pub struct RegisterUserOutput {
    /// The ID of the user
    id: Uuid,
}
