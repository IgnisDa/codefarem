use async_graphql::{Context, ErrorExtensions, Object, Result};
use auth::{get_user_id_from_authorization_token, AuthError};
use macros::{to_result_union_response, user_id_from_request};
use uuid::Uuid;

use crate::RequestData;

use super::{
    dto::{
        mutations::create_class::{CreateClassInput, CreateClassResultUnion},
        queries::class_details::ClassDetailsResultUnion,
    },
    service::{LearningService, LearningServiceTrait},
};

/// The query segment for Learning
#[derive(Default)]
pub struct LearningQuery {}

/// The mutation segment for Learning
#[derive(Default)]
pub struct LearningMutation {}

#[Object]
impl LearningQuery {
    /// Get information about a class
    async fn class_details(
        &self,
        ctx: &Context<'_>,
        class_id: Uuid,
    ) -> Result<ClassDetailsResultUnion> {
        let output = ctx
            .data_unchecked::<LearningService>()
            .class_details(class_id)
            .await;
        to_result_union_response!(output, ClassDetailsResultUnion)
    }
}

#[Object]
impl LearningMutation {
    /// Create a new class
    async fn create_class(
        &self,
        ctx: &Context<'_>,
        input: CreateClassInput,
    ) -> Result<CreateClassResultUnion> {
        let user_id = user_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<LearningService>()
            .create_class(&user_id, input.name(), input.teacher_ids())
            .await;
        to_result_union_response!(output, CreateClassResultUnion)
    }
}
