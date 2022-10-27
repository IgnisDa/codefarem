use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};

/// An error type with an attached field to tell what went wrong
#[derive(Debug, Default, Deserialize, Serialize, SimpleObject)]
pub struct ApiError {
    /// The error describing what went wrong
    pub error: String,
}
