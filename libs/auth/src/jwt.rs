use serde::{Deserialize, Serialize};
use utilities::users::AccountType;

#[derive(Debug, Deserialize, Serialize)]
pub struct Claim {
    pub sub: String,
    // the type of account
    pub at: AccountType,
    pub exp: usize,
}
