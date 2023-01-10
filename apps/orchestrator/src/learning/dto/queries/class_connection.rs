use async_graphql::SimpleObject;
use edgedb_derive::Queryable;
use serde::Deserialize;
use utilities::services::graphql_connection::HasId;
use uuid::Uuid;

#[derive(Debug, SimpleObject, Deserialize, Queryable)]
pub struct ClassPartialsDetails {
    /// The unique identifier of the class
    pub id: Uuid,

    /// The name/title of the class
    pub name: String,

    /// The detailed markdown text explaining the class
    pub join_slug: String,

    /// The number of teachers for this class
    pub num_teachers: i64,

    /// The number of students for this class
    pub num_students: i64,
}

impl HasId for ClassPartialsDetails {
    fn id(&self) -> String {
        self.id.to_string()
    }
}
