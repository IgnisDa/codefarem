use crate::{
    config::AppConfig,
    learning::{
        dto::{
            mutations::{
                create_class::{CreateClassInput, CreateClassResultUnion},
                create_question::{CreateQuestionInput, CreateQuestionResultUnion},
                execute_code_for_question::{
                    ExecuteCodeForQuestionInput, ExecuteCodeForQuestionResultUnion,
                },
            },
            queries::{
                class_details::ClassDetailsResultUnion,
                question_details::QuestionDetailsResultUnion, test_case::TestCaseUnit,
            },
        },
        service::LearningService,
    },
    utils::RequestData,
};
use async_graphql::{Context, ErrorExtensions, Object, Result};
use auth::{get_hanko_id_from_authorization_token, AuthError};
use macros::{hanko_id_from_request, to_result_union_response};
use uuid::Uuid;

use super::dto::queries::all_questions::QuestionPartialsDetails;

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

    /// Get all the questions
    async fn all_questions(&self, ctx: &Context<'_>) -> Vec<QuestionPartialsDetails> {
        ctx.data_unchecked::<LearningService>()
            .all_questions()
            .await
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

    /// Get information about a question and the test cases related to it
    async fn question_details(
        &self,
        ctx: &Context<'_>,
        question_slug: String,
    ) -> Result<QuestionDetailsResultUnion> {
        let output = ctx
            .data_unchecked::<LearningService>()
            .question_details(&question_slug)
            .await;
        to_result_union_response!(output, QuestionDetailsResultUnion)
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
        let hanko_id = hanko_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<LearningService>()
            .create_class(&hanko_id, input.name(), input.teacher_ids())
            .await;
        to_result_union_response!(output, CreateClassResultUnion)
    }

    /// Create a new question
    async fn create_question(
        &self,
        ctx: &Context<'_>,
        input: CreateQuestionInput,
    ) -> Result<CreateQuestionResultUnion> {
        let hanko_id = hanko_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<LearningService>()
            .create_question(
                &hanko_id,
                input.name(),
                input.problem(),
                input.test_cases(),
                input.class_ids(),
            )
            .await;
        to_result_union_response!(output, CreateQuestionResultUnion)
    }

    /// Execute an input code for the selected language and question
    async fn execute_code_for_question(
        &self,
        ctx: &Context<'_>,
        input: ExecuteCodeForQuestionInput,
    ) -> Result<ExecuteCodeForQuestionResultUnion> {
        let output = ctx
            .data_unchecked::<LearningService>()
            .execute_code_for_question(
                input.question_slug(),
                input.execute_input().code(),
                input.execute_input().language(),
            )
            .await;
        to_result_union_response!(output, ExecuteCodeForQuestionResultUnion)
    }
}
