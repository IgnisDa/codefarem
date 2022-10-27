use edgedb_derive::Queryable;
use uuid::Uuid;

#[derive(Queryable)]
pub struct IdObject {
    pub id: Uuid,
}
