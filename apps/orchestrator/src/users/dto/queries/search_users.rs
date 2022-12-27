use async_graphql::{InputObject, SimpleObject};
use derive_getters::Getters;
use serde::Deserialize;
use utilities::graphql::UserProfileInformation;
use uuid::Uuid;

#[derive(InputObject, Debug, Getters)]
pub struct SearchUsersInput {
    pub username: Option<String>,
}

#[derive(SimpleObject, Debug, Deserialize, Clone, Default)]
pub struct SearchUsersDetails {
    pub id: Uuid,
    pub profile: UserProfileInformation,
}

// https://www.edgedb.com/docs/edgeql/group
#[derive(SimpleObject, Debug, Deserialize)]
pub struct SearchUsersGroup {
    pub teachers: Vec<SearchUsersDetails>,
    pub students: Vec<SearchUsersDetails>,
}
