use super::{
    dto::{
        mutations::{
            create_class::{CreateClassInput, CreateClassResultUnion},
            create_question::{CreateQuestionInput, CreateQuestionResultUnion},
            execute_code_for_question::{
                ExecuteCodeForQuestionInput, ExecuteCodeForQuestionResultUnion,
            },
        },
        queries::{
            class_details::ClassDetailsResultUnion, question_details::QuestionDetailsResultUnion,
            test_case::TestCaseUnit,
        },
    },
    service::LearningService,
};
use crate::RequestData;
use async_graphql::{Context, ErrorExtensions, Object, Result};
use auth::{get_hanko_id_from_authorization_token, AuthError};
use macros::{to_result_union_response, user_id_from_request};
use utilities::users::AccountType;
use uuid::Uuid;

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
        let user_id = user_id_from_request!(ctx);
        // FIXME: Use correct value
        let account_type = AccountType::Teacher;
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
        let user_id = user_id_from_request!(ctx);
        // FIXME: Use correct value
        let account_type = AccountType::Teacher;
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
