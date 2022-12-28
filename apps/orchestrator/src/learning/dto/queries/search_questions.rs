use super::questions_connection::QuestionPartialsDetails;
use async_graphql::SimpleObject;
use edgedb_derive::Queryable;

#[derive(Debug, SimpleObject, Queryable)]
pub struct SearchQuestionsOutput {
    results: Vec<QuestionPartialsDetails>,
    total: i64,
}
