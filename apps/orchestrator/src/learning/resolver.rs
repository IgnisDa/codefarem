use crate::{
    config::AppConfig,
    learning::{
        dto::{
            mutations::{
                delete_question::{DeleteQuestionInput, DeleteQuestionResultUnion},
                execute_code_for_question::{
                    ExecuteCodeForQuestionInput, ExecuteCodeForQuestionResultUnion,
                },
                upsert_class::{UpsertClassInput, UpsertClassResultUnion},
                upsert_question::{UpsertQuestionInput, UpsertQuestionResultUnion},
            },
            queries::{
                class_connection::ClassPartialsDetails, class_details::ClassDetailsResultUnion,
                question_details::QuestionDetailsResultUnion,
                questions_connection::QuestionPartialsDetails,
                search_questions::SearchQuestionsOutput, test_case::TestCaseUnit,
            },
        },
        service::LearningService,
    },
    utils::RequestData,
};
use async_graphql::{
    connection::{Connection, EmptyFields},
    Context, ErrorExtensions, Object, Result,
};
use auth::{get_hanko_id_from_authorization_token, AuthError};
use macros::{hanko_id_from_request, to_result_union_response};
use utilities::graphql::{ConnectionArguments, SearchQueryInput};
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

    /// Search for questions. If no query is provided, all questions are returned.
    async fn search_questions(
        &self,
        ctx: &Context<'_>,
        input: SearchQueryInput,
    ) -> SearchQuestionsOutput {
        ctx.data_unchecked::<LearningService>()
            .search_questions(input.query_string())
            .await
    }

    /// Get a paginated list of questions in the relay connection format. It uses a cursor
    /// based pagination.
    async fn questions_connection(
        &self,
        ctx: &Context<'_>,
        args: ConnectionArguments,
    ) -> Result<Connection<String, QuestionPartialsDetails, EmptyFields, EmptyFields>> {
        ctx.data_unchecked::<LearningService>()
            .questions_connection(args.after, args.before, args.first, args.last)
            .await
    }

    /// Get a paginated list of classes in the relay connection format.
    async fn classes_connection(
        &self,
        ctx: &Context<'_>,
        args: ConnectionArguments,
    ) -> Result<Connection<String, ClassPartialsDetails, EmptyFields, EmptyFields>> {
        ctx.data_unchecked::<LearningService>()
            .classes_connection(args.after, args.before, args.first, args.last)
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
    /// Create a new class or update an existing one
    async fn upsert_class(
        &self,
        ctx: &Context<'_>,
        input: UpsertClassInput,
    ) -> Result<UpsertClassResultUnion> {
        let hanko_id = hanko_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<LearningService>()
            .upsert_class(
                &hanko_id,
                input.name(),
                input.teacher_ids(),
                input.student_ids(),
            )
            .await;
        to_result_union_response!(output, UpsertClassResultUnion)
    }

    /// Upsert a question (create if it doesn't exist, update if it does)
    async fn upsert_question(
        &self,
        ctx: &Context<'_>,
        input: UpsertQuestionInput,
    ) -> Result<UpsertQuestionResultUnion> {
        let hanko_id = hanko_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<LearningService>()
            .upsert_question(
                &hanko_id,
                input.name(),
                input.problem(),
                input.test_cases(),
                input.update_slug(),
            )
            .await;
        to_result_union_response!(output, UpsertQuestionResultUnion)
    }

    /// Delete a question
    async fn delete_question(
        &self,
        ctx: &Context<'_>,
        input: DeleteQuestionInput,
    ) -> Result<DeleteQuestionResultUnion> {
        let hanko_id = hanko_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<LearningService>()
            .delete_question(&hanko_id, input.question_slug())
            .await;
        to_result_union_response!(output, DeleteQuestionResultUnion)
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
