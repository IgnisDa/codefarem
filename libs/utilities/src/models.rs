use async_graphql::SimpleObject;
use edgedb_derive::Queryable;
use uuid::Uuid;

#[derive(Debug, Queryable, SimpleObject)]
pub struct IdObject {
    pub id: Uuid,
}
