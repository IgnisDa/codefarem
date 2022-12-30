use async_graphql::Union;
use utilities::{graphql::ApiError, models::IdObject};

/// The output object when deleting a class
#[derive(Union)]
pub enum DeleteClassResultUnion {
    /// The type returned if deleting the class was successful
    Result(IdObject),

    /// The type returned if deleting the class was unsuccessful
    Error(ApiError),
}
