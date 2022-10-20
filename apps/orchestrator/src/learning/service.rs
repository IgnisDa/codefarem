use std::sync::Arc;

use async_trait::async_trait;
use edgedb_tokio::Client as DbClient;
use utilities::{graphql::ApiError, users::AccountType};
use uuid::Uuid;

use crate::common::users::get_account_type_from_user_id;

use super::dto::{
    mutations::create_class::CreateClassOutput, queries::class_details::ClassDetailsOutput,
};

const CLASS_DETAILS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/class-details.edgeql");
const CREATE_CLASS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/create-class.edgeql");

#[async_trait]
pub trait LearningServiceTrait: Sync + Send {
    async fn class_details<'a>(&self, class_id: Uuid) -> Result<ClassDetailsOutput, ApiError>;
    async fn create_class<'a>(
        &self,
        user_id: &Uuid,
        name: &'a str,
        teacher_ids: &[Uuid],
    ) -> Result<CreateClassOutput, ApiError>;
}

pub struct LearningService {
    pub db_conn: Arc<DbClient>,
}

impl LearningService {
    pub fn new(db_conn: &Arc<DbClient>) -> Self {
        Self {
            db_conn: db_conn.clone(),
        }
    }
}

impl LearningService {}

#[async_trait]
impl LearningServiceTrait for LearningService {
    async fn class_details<'a>(&self, class_id: Uuid) -> Result<ClassDetailsOutput, ApiError> {
        self.db_conn
            .query_required_single::<ClassDetailsOutput, _>(CLASS_DETAILS, &(class_id,))
            .await
            .map_err(|_| ApiError {
                error: format!("Class with id={class_id} not found"),
            })
    }

    async fn create_class<'a>(
        &self,
        user_id: &Uuid,
        name: &'a str,
        teacher_ids: &[Uuid],
    ) -> Result<CreateClassOutput, ApiError> {
        let account_type = get_account_type_from_user_id(&self.db_conn, user_id)
            .await
            .map_err(|_| ApiError {
                error: "Could not get account type".to_string(),
            })?;
        if !matches!(account_type, AccountType::Teacher) {
            return Err(ApiError {
                error: "Only teachers can create classes".to_string(),
            });
        }
        let mut all_teachers_to_insert = teacher_ids.to_vec();
        all_teachers_to_insert.push(*user_id);
        self.db_conn
            .query_required_single::<CreateClassOutput, _>(
                CREATE_CLASS,
                &(name, all_teachers_to_insert),
            )
            .await
            .map_err(|_| ApiError {
                error: "Error creating class".to_string(),
            })
    }
}
