use async_graphql::SimpleObject;
use edgedb_derive::Queryable;
use serde::Deserialize;
use utilities::services::graphql_connection::HasId;
use uuid::Uuid;

#[derive(Debug, SimpleObject, Deserialize, Queryable)]
pub struct QuestionPartialsDetails {
    /// The unique identifier of the question
    pub id: Uuid,

    // TODO: Use date-time type for this, for eg:
    // https://async-graphql.github.io/async-graphql/en/custom_scalars.html
    /// The date-time when this question was created
    pub created_time: String,

    /// The name/title of the question
    pub name: String,

    /// The detailed markdown text explaining the question
    pub slug: String,

    /// The number of test cases that are related to this question
    pub num_test_cases: i64,
}

impl HasId for QuestionPartialsDetails {
    fn id(&self) -> String {
        self.id.to_string()
    }
}
