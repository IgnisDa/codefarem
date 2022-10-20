use std::{str::FromStr, sync::Arc};

use async_graphql::Enum;
use edgedb_tokio::Client as DbClient;
use strum::Display;
use uuid::Uuid;

const USER_TYPE: &str =
    include_str!("../../../../libs/main-db/edgeql/users/get-typeof-user.edgeql");

/// The types of accounts a user can create
#[derive(Enum, Clone, Copy, PartialEq, Eq, Display)]
pub enum AccountType {
    Student,
    Teacher,
}

impl FromStr for AccountType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Student" | "users::Student" => Ok(Self::Student),
            "Teacher" | "users::Teacher" => Ok(Self::Teacher),
            _ => Err(()),
        }
    }
}

pub async fn get_account_type_from_user_id(
    db_conn: &Arc<DbClient>,
    user_id: &Uuid,
) -> Result<AccountType, ()> {
    let account_type_str = db_conn
        .query_required_single::<String, _>(USER_TYPE, &(user_id,))
        .await
        .map_err(|_| ())?;
    AccountType::from_str(&account_type_str).map_err(|_| ())
}
