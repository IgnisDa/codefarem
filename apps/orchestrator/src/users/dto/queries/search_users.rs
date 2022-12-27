use async_graphql::{InputObject, SimpleObject};
use derive_getters::Getters;
use serde::Deserialize;
use utilities::{graphql::UserProfileInformation, users::AccountType};
use uuid::Uuid;

#[derive(InputObject, Debug, Getters)]
pub struct SearchUsersInput {
    pub username: Option<String>,
}

#[derive(SimpleObject, Debug, Deserialize)]
pub struct SearchUsersDetails {
    pub id: Uuid,
    pub profile: UserProfileInformation,
}

#[derive(SimpleObject, Debug, Deserialize)]
pub struct SearchUsersKey {
    pub account_type: AccountType,
}

// https://www.edgedb.com/docs/edgeql/group
#[derive(SimpleObject, Debug, Deserialize)]
pub struct SearchUsersGroup {
    /// the name of the group (in this case the account type)
    pub key: SearchUsersKey,

    pub grouping: Vec<String>,

    /// the users in this group
    pub elements: Vec<SearchUsersDetails>,
}
