use async_graphql::MergedObject;
use domains::farem::resolver::FaremQuery;

/// The GraphQL top-level Query type
#[derive(MergedObject, Default)]
pub struct QueryRoot(FaremQuery);
