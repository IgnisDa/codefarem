use async_graphql::{Context, ErrorExtensions, Object, Result};
use auth::{get_user_id_from_authorization_token, AuthError};
use macros::{to_result_union_response, user_id_from_request};
use uuid::Uuid;

use crate::RequestData;

use super::{
    dto::{
        mutations::{
            create_class::{CreateClassInput, CreateClassResultUnion},
            create_question::{CreateQuestionInput, CreateQuestionResultUnion},
        },
        queries::{class_details::ClassDetailsResultUnion, test_case::TestCaseUnit},
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
    /// Get all the types of test case units possible
    async fn test_case_units(&self, ctx: &Context<'_>) -> Vec<TestCaseUnit> {
        ctx.data_unchecked::<LearningService>().test_case_units()
    }

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
        let (user_id, account_type) = user_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<LearningService>()
            .create_class(&user_id, &account_type, input.name(), input.teacher_ids())
            .await;
        to_result_union_response!(output, CreateClassResultUnion)
    }

    /// Create a new question
    async fn create_question(
        &self,
        ctx: &Context<'_>,
        input: CreateQuestionInput,
    ) -> Result<CreateQuestionResultUnion> {
        let (user_id, account_type) = user_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<LearningService>()
            .create_question(
                &user_id,
                &account_type,
                input.name(),
                input.problem(),
                input.test_cases(),
                input.class_ids(),
            )
            .await;
        to_result_union_response!(output, CreateQuestionResultUnion)
    }
}
