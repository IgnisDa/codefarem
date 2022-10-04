use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Claim {
    pub sub: String,
    pub exp: usize,
}
