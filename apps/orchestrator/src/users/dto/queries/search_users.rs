use async_graphql::SimpleObject;
use serde::Deserialize;
use utilities::graphql::UserProfileInformation;
use uuid::Uuid;

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
