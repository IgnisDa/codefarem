use std::{str::FromStr, sync::Arc};

use edgedb_tokio::Client as DbClient;
use utilities::users::AccountType;
use uuid::Uuid;

const USER_TYPE: &str =
    include_str!("../../../../libs/main-db/edgeql/users/get-typeof-user.edgeql");

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
