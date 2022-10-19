use std::sync::Arc;

use async_trait::async_trait;
use auth::{create_jwt_token, get_hashed_password, verify_password};
use config::JwtConfig;
use edgedb_derive::Queryable;
use edgedb_tokio::Client as DbClient;
use serde::{Deserialize, Serialize};
use utilities::graphql::ApiError;
use uuid::Uuid;

use super::dto::{
    mutations::register_user::{AccountType, RegisterUserError, RegisterUserOutput},
    queries::{
        login_user::{LoginError, LoginUserError, LoginUserOutput},
        user_details::UserDetailsOutput,
        user_with_email::{UserWithEmailError, UserWithEmailOutput},
    },
};

const USER_DETAILS: &str =
    include_str!("../../../../libs/main-db/edgeql/users/user-details.edgeql");
const USER_WITH_EMAIL: &str =
    include_str!("../../../../libs/main-db/edgeql/users/user-with-email.edgeql");
const REGISTER_USER: &str =
    include_str!("../../../../libs/main-db/edgeql/users/register-user.edgeql");
const CHECK_UNIQUENESS: &str =
    include_str!("../../../../libs/main-db/edgeql/users/check-uniqueness.edgeql");
const LOGIN_USER: &str = include_str!("../../../../libs/main-db/edgeql/users/login-user.edgeql");

#[async_trait]
pub trait UserServiceTrait: Sync + Send {
    async fn user_details<'a>(&self, user_id: Uuid) -> Result<UserDetailsOutput, ApiError>;

    async fn user_with_email<'a>(
        &self,
        email: &'a str,
    ) -> Result<UserWithEmailOutput, UserWithEmailError>;

    async fn logout_user<'a>(&self, user_id: Uuid) -> bool;

    async fn login_user<'a>(
        &self,
        email: &'a str,
        password: &'a str,
    ) -> Result<LoginUserOutput, LoginUserError>;

    async fn register_user<'a>(
        &self,
        username: &'a str,
        email: &'a str,
        password: &'a str,
        account_type: &AccountType,
    ) -> Result<RegisterUserOutput, RegisterUserError>;
}

pub struct UserService {
    pub db_conn: Arc<DbClient>,
    pub jwt_config: Arc<JwtConfig>,
}

impl UserService {
    pub fn new(db_conn: &Arc<DbClient>, jwt_config: &Arc<JwtConfig>) -> Self {
        Self {
            db_conn: db_conn.clone(),
            jwt_config: jwt_config.clone(),
        }
    }
}

impl UserService {}

#[async_trait]
impl UserServiceTrait for UserService {
    async fn user_details<'a>(&self, user_id: Uuid) -> Result<UserDetailsOutput, ApiError> {
        self.db_conn
            .query_required_single::<UserDetailsOutput, _>(USER_DETAILS, &(user_id,))
            .await
            .map_err(|_| ApiError {
                error: format!("User with id={user_id} not found"),
            })
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

    async fn logout_user<'a>(&self, user_id: Uuid) -> bool {
        println!("Logging out user with id={user_id}");
        true
    }

    async fn login_user<'a>(
        &self,
        email: &'a str,
        password: &'a str,
    ) -> Result<LoginUserOutput, LoginUserError> {
        #[derive(Debug, Deserialize, Queryable, Serialize)]
        struct A {
            password_hash: String,
        }
        #[derive(Debug, Deserialize, Queryable, Serialize)]
        struct B {
            id: Uuid,
            auth: A,
        }
        let login_details = self
            .db_conn
            .query::<B, _>(LOGIN_USER, &(email,))
            .await
            .unwrap();
        if login_details.is_empty() {
            return Err(LoginUserError {
                error: LoginError::CredentialsMismatch,
            });
        }
        let password_hash = &login_details[0].auth.password_hash;
        if verify_password(password, password_hash) {
            let token = create_jwt_token(
                self.jwt_config.jwt_secret(),
                login_details[0].id.to_string().as_str(),
            );
            Ok(LoginUserOutput { token })
        } else {
            Err(LoginUserError {
                error: LoginError::CredentialsMismatch,
            })
        }
    }

    async fn register_user<'a>(
        &self,
        username: &'a str,
        email: &'a str,
        password: &'a str,
        account_type: &AccountType,
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
        let password_hash = get_hashed_password(password);
        Ok(self
            .db_conn
            .query_required_single::<RegisterUserOutput, _>(
                new_query.as_str(),
                &(username, email, password_hash),
            )
            .await
            .unwrap())
    }
}
