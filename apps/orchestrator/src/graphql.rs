use super::{
    farem::resolver::{FaremMutation, FaremQuery},
    learning::resolver::{LearningMutation, LearningQuery},
    users::resolver::{UserMutation, UserQuery},
};
use async_graphql::MergedObject;

/// The GraphQL top-level query type
#[derive(MergedObject, Default)]
pub struct QueryRoot(FaremQuery, UserQuery, LearningQuery);

/// The GraphQL top-level mutation type
#[derive(MergedObject, Default)]
pub struct MutationRoot(FaremMutation, UserMutation, LearningMutation);
