use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema};

pub type GraphqlSchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn hello(&self) -> String {
        "hello".to_owned()
    }
}
