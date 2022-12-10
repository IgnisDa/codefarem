use async_graphql::{EmptySubscription, Object, Schema};

pub type GraphqlSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn hello(&self) -> String {
        "hello query".to_owned()
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn hello(&self) -> String {
        "hello mutation".to_owned()
    }
}
