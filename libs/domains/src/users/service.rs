use std::sync::Arc;

use async_trait::async_trait;
use edgedb_tokio::Client as DbClient;

use super::dto::mutations::RegisterUserOutput;

#[async_trait]
pub trait UserServiceTrait: Sync + Send {
    async fn register_user<'a>(
        &self,
        username: &'a str,
        email: &'a str,
        password: &'a str,
    ) -> RegisterUserOutput;
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
    ) -> RegisterUserOutput {
        self.db_conn
            .query_required_single::<RegisterUserOutput, _>(
                r#"
SELECT (
  INSERT User {
    profile := (INSERT UserProfile {
      username := <str>$0,
      email := <str>$1,
    }),
    auth := (INSERT UserAuth {
      password_hash := <str>$2
    })
  }
) {
    id
}
"#,
                &(username, email, password),
            )
            .await
            .unwrap()
    }
}
