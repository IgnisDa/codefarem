use edgedb_derive::Queryable;
use uuid::Uuid;

#[derive(Debug, Queryable)]
pub struct IdObject {
    pub id: Uuid,
}
