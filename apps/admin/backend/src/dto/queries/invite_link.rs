use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};
use utilities::users::AccountType;

#[derive(SimpleObject, Serialize, Deserialize)]
pub struct InviteLinkDto {
    id: String,

    token: String,

    is_active: bool,

    email: Option<String>,

    expires_at: String,

    used_at: Option<String>,

    role: AccountType,
}
