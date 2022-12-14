use async_graphql::SimpleObject;
use edgedb_derive::Queryable;
use serde::Deserialize;

#[derive(Debug, SimpleObject, Deserialize, Queryable)]
pub struct QuestionPartialsDetails {
    /// The date-time when this question was created
    pub created_time: String,

    /// The name/title of the question
    pub name: String,

    /// The detailed markdown text explaining the question
    pub slug: String,

    /// The number of test cases that are related to this question
    pub num_test_cases: i64,
}
