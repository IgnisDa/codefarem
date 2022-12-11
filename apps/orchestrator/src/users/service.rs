use super::dto::{
    mutations::register_user::RegisterUserOutput,
    queries::{
        user_details::UserDetailsOutput,
        user_with_email::{UserWithEmailError, UserWithEmailOutput},
    },
};
use chrono::DateTime;
use edgedb_tokio::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use utilities::{graphql::ApiError, users::AccountType};
use uuid::Uuid;

const USER_DETAILS: &str =
    include_str!("../../../../libs/main-db/edgeql/users/user-details.edgeql");
const USER_WITH_EMAIL: &str =
    include_str!("../../../../libs/main-db/edgeql/users/user-with-email.edgeql");
const REGISTER_USER: &str =
    include_str!("../../../../libs/main-db/edgeql/users/register-user.edgeql");
const USE_INVITE_LINK: &str =
    include_str!("../../../../libs/main-db/edgeql/external/use-invite-link.edgeql");
const GET_INVITE_LINK: &str =
    include_str!("../../../../libs/main-db/edgeql/external/get-invite-link.edgeql");

pub struct UserService {
    db_conn: Arc<Client>,
}

impl UserService {
    pub fn new(db_conn: &Arc<Client>) -> Self {
        Self {
            db_conn: db_conn.clone(),
        }
    }
}

impl UserService {
    pub async fn user_details<'a>(&self, hanko_id: &'a str) -> Result<UserDetailsOutput, ApiError> {
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

    pub async fn user_with_email<'a>(
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

    pub async fn register_user<'a>(
        &self,
        username: &'a str,
        email: &'a str,
        hanko_id: &'a str,
        invite_token: &Option<String>,
    ) -> Result<RegisterUserOutput, ApiError> {
        let account_type = if let Some(it) = invite_token {
            #[derive(Serialize, Deserialize)]
            struct A {
                id: Uuid,
                is_active: bool,
                email: Option<String>,
                expires_at: String,
                role: AccountType,
            }
            let invite_link = self
                .db_conn
                .query_single_json(GET_INVITE_LINK, &(it,))
                .await
                .map_err(|e| {
                    eprintln!("Error: {e:?}");
                    ApiError {
                        error: "Invite link not found".to_string(),
                    }
                })?
                .unwrap();
            let invite_link: A = serde_json::from_str(&invite_link).unwrap();
            let now = chrono::Utc::now();
            if !invite_link.is_active {
                return Err(ApiError {
                    error: "Invite link is no longer active".to_string(),
                });
            }
            if DateTime::parse_from_rfc3339(&invite_link.expires_at).unwrap() < now {
                return Err(ApiError {
                    error: "Invite link has expired".to_string(),
                });
            }
            if invite_link.email != Some(email.to_string()) {
                return Err(ApiError {
                    error: "Invite link is not for this email".to_string(),
                });
            }
            self.db_conn
                .query_json(USE_INVITE_LINK, &(invite_link.id, now.to_rfc3339()))
                .await
                .expect("oh no!");
            invite_link.role
        } else {
            AccountType::Student
        };

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
