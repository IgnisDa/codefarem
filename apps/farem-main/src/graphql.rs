use async_graphql::MergedObject;
use domains::farem::resolver::{FaremMutation, FaremQuery};

/// The GraphQL top-level query type
#[derive(MergedObject, Default)]
pub struct QueryRoot(FaremQuery);

/// The GraphQL top-level mutation type
#[derive(MergedObject, Default)]
pub struct MutationRoot(FaremMutation);
