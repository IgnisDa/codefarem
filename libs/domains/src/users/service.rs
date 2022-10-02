use std::sync::Arc;

use async_trait::async_trait;
use auth::get_hashed_password;
use edgedb_tokio::Client as DbClient;

use super::dto::mutations::register_user::{RegisterUserError, RegisterUserOutput};

const REGISTER_USER: &str = include_str!("../../../main-db/edgeql/register-user.edgeql");
const CHECK_UNIQUENESS: &str = include_str!("../../../main-db/edgeql/check-uniqueness.edgeql");

#[async_trait]
pub trait UserServiceTrait: Sync + Send {
    async fn register_user<'a>(
        &self,
        username: &'a str,
        email: &'a str,
        password: &'a str,
    ) -> Result<RegisterUserOutput, RegisterUserError>;
}

pub struct UserService {
    pub db_conn: Arc<DbClient>,
}

impl UserService {
    pub fn new(db_conn: &Arc<DbClient>) -> Self {
        Self {
            db_conn: db_conn.clone(),
        }
    }
}

impl UserService {}

#[async_trait]
impl UserServiceTrait for UserService {
    async fn register_user<'a>(
        &self,
        username: &'a str,
        email: &'a str,
        password: &'a str,
    ) -> Result<RegisterUserOutput, RegisterUserError> {
        // FIXME: For whatever reason, `query_required_single` does not work. This gets the
        // result as JSON and then converts it to the required struct.
        let check_uniqueness = serde_json::from_str::<RegisterUserError>(
            self.db_conn
                .query_required_single_json(CHECK_UNIQUENESS, &(username, email))
                .await
                .unwrap()
                .to_string()
                .as_str(),
        )
        .unwrap();
        if check_uniqueness != RegisterUserError::default() {
            return Err(check_uniqueness);
        }
        let password_hash = get_hashed_password(password);
        Ok(self
            .db_conn
            .query_required_single::<RegisterUserOutput, _>(
                REGISTER_USER,
                &(username, email, password_hash),
            )
            .await
            .unwrap())
    }
}
