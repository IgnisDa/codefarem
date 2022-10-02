use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum Role {
    User,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Claim {
    pub sub: String,
    pub role: Role,
    pub exp: usize,
}
