use async_graphql::{InputObject, SimpleObject};
use derive_getters::Getters;
use edgedb_derive::Queryable;
use uuid::Uuid;

/// Used to uniquely identify an output object. Can also be used to query the database.
#[derive(Debug, Queryable, SimpleObject, Clone)]
pub struct IdObject {
    /// The unique identifier of the object
    pub id: Uuid,
}

/// Used to uniquely identify an input object
#[derive(Debug, InputObject, Getters)]
pub struct InputIdObject {
    /// The unique identifier of the object
    pub id: Uuid,
}
