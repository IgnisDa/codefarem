use crate::dto::{
    mutations::create_invite_link::CreateInviteLinkOutput, queries::invite_link::InviteLinkDto,
};
use chrono::{Duration, Utc};
use edgedb_tokio::Client;
use humantime::format_duration;
use log::error;
use mailer::Mailer;
use std::sync::Arc;
use utilities::{graphql::ApiError, random_string, users::AccountType};

const ALL_INVITE_LINKS: &str =
    include_str!("../../../../libs/main-db/edgeql/external/all-invite-links.edgeql");
const CREATE_INVITE_LINK: &str =
    include_str!("../../../../libs/main-db/edgeql/external/create-invite-link.edgeql");

pub struct Service {
    pub db_conn: Arc<Client>,
    pub mailer: Arc<Mailer>,
}

impl Service {
    pub async fn all_invite_links(&self) -> Vec<InviteLinkDto> {
        let json_invite_links = self
            .db_conn
            .query_json(ALL_INVITE_LINKS, &())
            .await
            .unwrap()
            .to_string();
        serde_json::from_str(&json_invite_links).unwrap()
    }

    pub async fn create_invite_link(
        &self,
        email: &Option<String>,
        account_type: &AccountType,
        valid_for: &'_ str,
    ) -> Result<CreateInviteLinkOutput, ApiError> {
        // TODO: Add check to confirm it is unique and that the email is not already in use
        let token = random_string(10);
        let duration = humantime::parse_duration(valid_for).map_err(|_| ApiError {
            error: format!("Could not convert {valid_for:?} to a valid duration"),
        })?;
        let expires_at = (Utc::now()
            + Duration::from_std(duration).expect("Could not add durations"))
        .to_rfc3339();
        let invite_link = self
            .db_conn
            .query_required_single::<CreateInviteLinkOutput, _>(
                CREATE_INVITE_LINK,
                &(
                    email.to_owned(),
                    &expires_at,
                    &account_type.to_string(),
                    &token,
                ),
            )
            .await
            .map_err(|e| {
                error!("{}", e);
                ApiError {
                    error: "Could not create invite link".to_string(),
                }
            })?;
        if let Some(e) = email {
            self.mailer
                .create_invite_link(
                    e,
                    &account_type.to_string(),
                    &token,
                    &format_duration(duration).to_string(),
                )
                .await
                .map_err(|_| ApiError {
                    error: "Could not send invite link".to_string(),
                })?;
        }
        Ok(invite_link)
    }
}
