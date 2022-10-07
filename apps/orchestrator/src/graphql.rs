use async_graphql::MergedObject;
use domains::{
    farem::resolver::{FaremMutation, FaremQuery},
    users::resolver::{UserMutation, UserQuery},
};

/// The GraphQL top-level query type
#[derive(MergedObject, Default)]
pub struct QueryRoot(FaremQuery, UserQuery);

/// The GraphQL top-level mutation type
#[derive(MergedObject, Default)]
pub struct MutationRoot(FaremMutation, UserMutation);