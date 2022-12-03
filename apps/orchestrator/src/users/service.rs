use super::dto::{
    mutations::register_user::{RegisterUserError, RegisterUserOutput},
    queries::{
        user_details::UserDetailsOutput,
        user_with_email::{UserWithEmailError, UserWithEmailOutput},
    },
};
use async_trait::async_trait;
use edgedb_tokio::Client as DbClient;
use std::sync::Arc;
use utilities::{graphql::ApiError, users::AccountType};

const USER_DETAILS: &str =
    include_str!("../../../../libs/main-db/edgeql/users/user-details.edgeql");
const USER_WITH_EMAIL: &str =
    include_str!("../../../../libs/main-db/edgeql/users/user-with-email.edgeql");
const REGISTER_USER: &str =
    include_str!("../../../../libs/main-db/edgeql/users/register-user.edgeql");
const CHECK_UNIQUENESS: &str =
    include_str!("../../../../libs/main-db/edgeql/users/check-uniqueness.edgeql");

#[async_trait]
pub trait UserServiceTrait: Sync + Send {
    async fn user_details<'a>(&self, hanko_id: &'a str) -> Result<UserDetailsOutput, ApiError>;

    async fn user_with_email<'a>(
        &self,
        email: &'a str,
    ) -> Result<UserWithEmailOutput, UserWithEmailError>;

    async fn register_user<'a>(
        &self,
        username: &'a str,
        email: &'a str,
        account_type: &AccountType,
        hanko_id: &'a str,
    ) -> Result<RegisterUserOutput, RegisterUserError>;
}

pub struct UserService {
    db_conn: Arc<DbClient>,
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
    async fn user_details<'a>(&self, hanko_id: &'a str) -> Result<UserDetailsOutput, ApiError> {
        let json_str = self
            .db_conn
            .query_json(USER_DETAILS, &(hanko_id,))
            .await
            .map_err(|_| ApiError {
                error: format!("User with hanko_id={hanko_id} not found"),
            })?;
        Ok(serde_json::from_str::<Vec<UserDetailsOutput>>(&json_str)
            .unwrap()
            .get(0)
            .unwrap()
            .clone())
    }

    async fn user_with_email<'a>(
        &self,
        email: &'a str,
    ) -> Result<UserWithEmailOutput, UserWithEmailError> {
        let all_users = self
            .db_conn
            .query::<UserWithEmailOutput, _>(USER_WITH_EMAIL, &(email,))
            .await
            .unwrap();
        if all_users.is_empty() {
            return Err(UserWithEmailError {
                error: format!("User with email={email} not found"),
            });
        }
        Ok(all_users.get(0).unwrap().to_owned())
    }

    async fn register_user<'a>(
        &self,
        username: &'a str,
        email: &'a str,
        account_type: &AccountType,
        hanko_id: &'a str,
    ) -> Result<RegisterUserOutput, RegisterUserError> {
        let check_uniqueness = self
            .db_conn
            .query_required_single::<RegisterUserError, _>(CHECK_UNIQUENESS, &(username, email))
            .await
            .unwrap();
        if check_uniqueness != RegisterUserError::default() {
            return Err(check_uniqueness);
        }
        let account_type_string = account_type.to_string();
        // replace `User` in REGISTER_USER with the correct account_type
        let new_query = REGISTER_USER.replace("{User}", account_type_string.as_str());
        Ok(self
            .db_conn
            .query_required_single::<RegisterUserOutput, _>(
                new_query.as_str(),
                &(username, email, hanko_id),
            )
            .await
            .unwrap())
    }
}
