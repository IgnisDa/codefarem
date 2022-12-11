use crate::dto::{
    mutations::create_invite_link::CreateInviteLinkOutput, queries::invite_link::InviteLinkDto,
};
use chrono::{Duration, Utc};
use edgedb_tokio::Client;
use lettre::SmtpTransport;
use log::error;
use std::sync::Arc;
use utilities::{graphql::ApiError, random_string, users::AccountType};

const ALL_INVITE_LINKS: &str =
    include_str!("../../../../libs/main-db/edgeql/external/all-invite-links.edgeql");
const CREATE_INVITE_LINK: &str =
    include_str!("../../../../libs/main-db/edgeql/external/create-invite-link.edgeql");

pub struct Service {
    pub db_conn: Arc<Client>,
    pub mailer: Arc<SmtpTransport>,
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
        let token = random_string(10);
        // TODO: Add check to confirm it is unique
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
        if let Some(_e) = email {
            // TODO: Send email
        }
        Ok(invite_link)
    }
}
