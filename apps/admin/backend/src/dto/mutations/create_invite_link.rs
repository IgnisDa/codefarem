use async_graphql::{InputObject, SimpleObject, Union};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use utilities::{graphql::ApiError, users::AccountType};

#[derive(InputObject, Getters)]
pub struct CreateInviteLinkInput {
    /// The email address of the user to invite
    email: Option<String>,

    /// The type of account to create
    account_type: AccountType,

    /// The time for which the invite link is valid
    valid_for: String,
}

/// The result type if the invite link was created successfully
#[derive(SimpleObject, Queryable)]
pub struct CreateInviteLinkOutput {
    /// The unique token associated with the invite link
    pub token: String,
}

/// The output object when creating a new class
#[derive(Union)]
pub enum CreateInviteLinkResultUnion {
    /// The type returned if creating a new invite link was successful
    Result(CreateInviteLinkOutput),

    /// The type returned if creating a new invite link was unsuccessful
    Error(ApiError),
}
