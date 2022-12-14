use crate::{
    farem::{
        dto::mutations::execute_code::{ExecuteCodeError, ExecuteCodeErrorStep, ExecuteCodeTime},
        service::FaremService,
    },
    learning::dto::{
        mutations::{
            execute_code_for_question::{
                ExecuteCodeForQuestionOutput, TestCaseResultUnion, TestCaseSuccessStatus,
            },
            upsert_question::UpsertQuestionOutput,
        },
        queries::{
            class_connection::ClassPartialsDetails,
            class_details::ClassDetailsOutput,
            question_details::QuestionDetailsOutput,
            questions_connection::QuestionPartialsDetails,
            search_questions::SearchQuestionsOutput,
            test_case::{TestCase, TestCaseUnit},
        },
    },
    utils::log_error_and_return_api_error,
};
use async_graphql::{
    connection::{Connection, EmptyFields},
    Result,
};
use auth::validate_user_role;
use edgedb_tokio::Client;
use std::sync::Arc;
use strum::IntoEnumIterator;
use utilities::{
    diff::get_diff_of_lines,
    graphql::{ApiError, RangeInput},
    models::IdObject,
    random_string,
    services::GraphQLConnectionService,
    users::{get_user_details_from_hanko_id, AccountType},
    SupportedLanguage,
};
use uuid::Uuid;

const PAGINATED_QUESTIONS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/paginated-questions.edgeql");
const SEARCH_QUESTIONS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/search-questions.edgeql");
const PAGINATED_CLASSES: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/paginated-classes.edgeql");
const IS_SLUG_NOT_UNIQUE: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/is-slug-not-unique.edgeql");
const QUESTION_DETAILS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/question-details.edgeql");
const DELETE_CLASS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/delete-class.edgeql");
const DELETE_QUESTION: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/delete-question.edgeql");
const CLASS_DETAILS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/class-details.edgeql");
const UPSERT_CLASS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/upsert-class.edgeql");
const ASSOCIATE_USERS_WITH_CLASS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/associate-users-with-class.edgeql");
const UPSERT_QUESTION: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/upsert-question.edgeql");
const DELETE_TEST_CASES: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/delete-test-cases.edgeql");
const INSERT_NUMBER_COLLECTION_UNIT: &str = include_str!(
    "../../../../libs/main-db/edgeql/learning/test-cases/number-collection-unit.edgeql"
);
const INSERT_NUMBER_UNIT: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/test-cases/number-unit.edgeql");
const INSERT_STRING_UNIT: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/test-cases/string-unit.edgeql");
const INSERT_STRING_COLLECTION_UNIT: &str = include_str!(
    "../../../../libs/main-db/edgeql/learning/test-cases/string-collection-unit.edgeql"
);
const INSERT_INPUT_CASE_UNIT: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/test-cases/input-case-unit.edgeql");
const INSERT_OUTPUT_CASE_UNIT: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/test-cases/output-case-unit.edgeql");
const INSERT_TEST_CASE: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/test-cases/test-case.edgeql");
const UPDATE_QUESTION: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/test-cases/update-question.edgeql");
const CREATE_QUESTION_INSTANCES: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/create-question-instances.edgeql");
const CREATE_GOAL: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/create-goal.edgeql");

pub struct LearningService {
    db_conn: Arc<Client>,
    farem_service: Arc<FaremService>,
    graphql_connection_service: GraphQLConnectionService,
}

impl LearningService {
    pub fn new(db_conn: &Arc<Client>, farem_service: &Arc<FaremService>) -> Self {
        let graphql_connection_service = GraphQLConnectionService::default();
        Self {
            db_conn: db_conn.clone(),
            farem_service: farem_service.clone(),
            graphql_connection_service,
        }
    }
}

impl LearningService {
    pub fn test_case_units(&self) -> Vec<TestCaseUnit> {
        TestCaseUnit::iter().collect()
    }

    pub async fn search_questions(&self, search_query: &Option<String>) -> SearchQuestionsOutput {
        let search_query = search_query.clone().unwrap_or_default();
        self.db_conn
            .query_required_single::<SearchQuestionsOutput, _>(SEARCH_QUESTIONS, &(search_query,))
            .await
            .unwrap()
    }

    pub async fn questions_connection(
        &self,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<String, QuestionPartialsDetails, EmptyFields, EmptyFields>> {
        self.graphql_connection_service
            .paginate_db_query(
                after,
                before,
                first,
                last,
                PAGINATED_QUESTIONS,
                &self.db_conn,
            )
            .await
    }

    pub async fn classes_connection(
        &self,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<String, ClassPartialsDetails, EmptyFields, EmptyFields>> {
        self.graphql_connection_service
            .paginate_db_query(after, before, first, last, PAGINATED_CLASSES, &self.db_conn)
            .await
    }

    pub async fn class_details(&self, join_slug: &str) -> Result<ClassDetailsOutput, ApiError> {
        self.db_conn
            .query_required_single::<ClassDetailsOutput, _>(CLASS_DETAILS, &(join_slug,))
            .await
            .map_err(|e| {
                log_error_and_return_api_error(e, &format!("Class with slug={join_slug} not found"))
            })
    }

    pub async fn question_details(
        &self,
        question_slug: &str,
    ) -> Result<QuestionDetailsOutput, ApiError> {
        let question_model = self
            .db_conn
            .query_single_json(QUESTION_DETAILS, &(&question_slug,))
            .await
            .unwrap()
            .ok_or_else(|| ApiError {
                error: format!("Question with slug={question_slug} not found"),
            })?;
        Ok(serde_json::from_str::<QuestionDetailsOutput>(&question_model).unwrap())
    }

    pub async fn upsert_class(
        &self,
        hanko_id: &str,
        join_slug: &Option<String>,
        name: &str,
        teacher_ids: &[Uuid],
        student_ids: &[Uuid],
    ) -> Result<IdObject, ApiError> {
        let user_details = get_user_details_from_hanko_id(hanko_id, &self.db_conn).await?;
        validate_user_role(&AccountType::Teacher, &user_details.account_type)?;
        let mut all_teachers_to_insert = teacher_ids.to_vec();
        all_teachers_to_insert.push(user_details.id);
        let slug = join_slug.clone().unwrap_or_else(|| random_string(8));
        let student_ids = student_ids.to_vec();
        let id_object = self
            .db_conn
            .query_required_single::<IdObject, _>(UPSERT_CLASS, &(name, slug))
            .await
            .map_err(|e| {
                log_error_and_return_api_error(
                    e,
                    "There was an error creating/updating the class, please try again.",
                )
            })?;
        self.db_conn
            .query_required_single_json(
                ASSOCIATE_USERS_WITH_CLASS,
                &(id_object.id, all_teachers_to_insert, student_ids),
            )
            .await
            .map_err(|e| {
                log_error_and_return_api_error(
                    e,
                    "There was an error associating users with the class",
                )
            })?;
        Ok(id_object)
    }

    pub async fn create_goal(
        &self,
        hanko_id: &str,
        class_id: &Uuid,
        name: &str,
        range: &RangeInput,
        color: &str,
        question_ids: &[Uuid],
    ) -> Result<IdObject, ApiError> {
        let user_details = get_user_details_from_hanko_id(hanko_id, &self.db_conn).await?;
        validate_user_role(&AccountType::Teacher, &user_details.account_type)?;
        let question_ids = question_ids.to_vec();
        let question_instances_objs = self
            .db_conn
            .query::<IdObject, _>(CREATE_QUESTION_INSTANCES, &(question_ids,))
            .await
            .map_err(|e| {
                log_error_and_return_api_error(
                    e,
                    "There was an error creating the question instances",
                )
            })?;
        let question_instances_ids = question_instances_objs
            .into_iter()
            .map(|q| q.id)
            .collect::<Vec<_>>();
        self.db_conn
            .query_required_single::<IdObject, _>(
                CREATE_GOAL,
                &(
                    class_id,
                    color,
                    range.start(),
                    range.end(),
                    name,
                    question_instances_ids,
                ),
            )
            .await
            .map_err(|e| {
                log_error_and_return_api_error(
                    e,
                    "There was an error creating the goal, please try again.",
                )
            })
    }

    pub async fn upsert_question(
        &self,
        hanko_id: &str,
        name: &str,
        problem: &str,
        test_cases: &[TestCase],
        update_slug: &Option<String>,
    ) -> Result<UpsertQuestionOutput, ApiError> {
        let user_details = get_user_details_from_hanko_id(hanko_id, &self.db_conn).await?;
        validate_user_role(&AccountType::Teacher, &user_details.account_type)?;
        // either the slug of the question to update or a new unique slug
        let slug = if let Some(update_slug) = update_slug {
            update_slug.to_string()
        } else {
            let mut new_slug = random_string(8);
            loop {
                let is_slug_not_unique = self
                    .db_conn
                    .query_required_single::<bool, _>(IS_SLUG_NOT_UNIQUE, &(&new_slug,))
                    .await
                    .unwrap();
                if !is_slug_not_unique {
                    break;
                }
                new_slug = random_string(8);
            }
            new_slug
        };
        let question = self
            .db_conn
            .query_required_single::<UpsertQuestionOutput, _>(
                UPSERT_QUESTION,
                &(name, problem, slug),
            )
            .await
            .map_err(|e| {
                log_error_and_return_api_error(
                    e,
                    "There was an error creating the question, please try again.",
                )
            })?;
        // delete all of the old test cases if any
        self.db_conn
            .query_json(DELETE_TEST_CASES, &(question.id,))
            .await
            .expect("Can not fail");
        fn get_insert_ql(test_case: &TestCaseUnit) -> &'static str {
            match test_case {
                TestCaseUnit::Number => INSERT_NUMBER_UNIT,
                TestCaseUnit::NumberCollection => INSERT_NUMBER_COLLECTION_UNIT,
                TestCaseUnit::String => INSERT_STRING_UNIT,
                TestCaseUnit::StringCollection => INSERT_STRING_COLLECTION_UNIT,
            }
        }
        let mut test_cases_to_associate = vec![];
        for test_case in test_cases.iter() {
            let mut input_case_units = vec![];
            let mut output_case_units = vec![];
            for (idx, input) in test_case.inputs.iter().enumerate() {
                let insert_ql = get_insert_ql(&input.data_type);
                let case_unit = self
                    .db_conn
                    .query_required_single::<IdObject, _>(insert_ql, &(&input.data,))
                    .await
                    .unwrap();
                let input_case_unit = self
                    .db_conn
                    .query_required_single::<IdObject, _>(
                        INSERT_INPUT_CASE_UNIT,
                        &(&input.name, idx as i32, case_unit.id),
                    )
                    .await
                    .unwrap();
                input_case_units.push(input_case_unit.id);
            }
            for (idx, output) in test_case.outputs.iter().enumerate() {
                let insert_ql = get_insert_ql(&output.data_type);
                let case_unit = self
                    .db_conn
                    .query_required_single::<IdObject, _>(insert_ql, &(&output.data,))
                    .await
                    .unwrap();
                let output_case_unit = self
                    .db_conn
                    .query_required_single::<IdObject, _>(
                        INSERT_OUTPUT_CASE_UNIT,
                        &(idx as i32, case_unit.id),
                    )
                    .await
                    .unwrap();
                output_case_units.push(output_case_unit.id);
            }
            let test_case_to_associate = self
                .db_conn
                .query_required_single::<IdObject, _>(
                    INSERT_TEST_CASE,
                    &(input_case_units, output_case_units),
                )
                .await
                .unwrap();
            test_cases_to_associate.push(test_case_to_associate.id);
        }

        self.db_conn
            .query_required_single::<IdObject, _>(
                UPDATE_QUESTION,
                &(question.id, test_cases_to_associate),
            )
            .await
            .unwrap();
        Ok(question)
    }

    pub async fn delete_class(
        &self,
        hanko_id: &str,
        class_id: &Uuid,
    ) -> Result<IdObject, ApiError> {
        let user_details = get_user_details_from_hanko_id(hanko_id, &self.db_conn).await?;
        validate_user_role(&AccountType::Teacher, &user_details.account_type)?;
        let question = self
            .db_conn
            .query_required_single::<IdObject, _>(DELETE_CLASS, &(class_id,))
            .await
            .map_err(|e| {
                log_error_and_return_api_error(
                    e,
                    "There was an error deleting the class, please try again.",
                )
            })?;
        Ok(question)
    }

    pub async fn delete_question(
        &self,
        hanko_id: &str,
        question_slug: &str,
    ) -> Result<IdObject, ApiError> {
        let user_details = get_user_details_from_hanko_id(hanko_id, &self.db_conn).await?;
        validate_user_role(&AccountType::Teacher, &user_details.account_type)?;
        let question = self
            .db_conn
            .query_required_single::<IdObject, _>(DELETE_QUESTION, &(question_slug,))
            .await
            .map_err(|e| {
                log_error_and_return_api_error(
                    e,
                    "There was an error deleting the question, please try again.",
                )
            })?;
        Ok(question)
    }

    pub async fn execute_code_for_question(
        &self,
        question_slug: &'_ str,
        code: &'_ str,
        language: &SupportedLanguage,
    ) -> Result<ExecuteCodeForQuestionOutput, ApiError> {
        let question_details = self
            .question_details(question_slug)
            .await
            .expect("There was an error in getting the correct question");
        let compiled_wasm = self
            .farem_service
            .compile_source(code, language)
            .await
            .map_err(|f| ApiError {
                error: format!("Failed to compile to wasm with error: {}", f),
            })?;
        let mut outputs = Vec::with_capacity(question_details.test_cases.len());
        let mut total_passed = 0;
        for test_case in question_details.test_cases.iter() {
            let arguments = test_case
                .inputs
                .iter()
                .map(|f| f.normalized_data.clone())
                .collect::<Vec<_>>();
            let user_output = match self
                .farem_service
                .send_execute_wasm_request(&compiled_wasm.data, &arguments, language)
                .await
            {
                Ok(f) => f,
                Err(f) => {
                    outputs.push(TestCaseResultUnion::Error(ExecuteCodeError {
                        error: f,
                        step: ExecuteCodeErrorStep::WasmExecution,
                    }));
                    continue;
                }
            };
            let expected_output = if test_case.outputs.is_empty() {
                "".to_string()
            } else {
                test_case
                    .outputs
                    .iter()
                    .map(|f| f.normalized_data.clone())
                    .collect::<Vec<_>>()
                    .join("\n")
                    + "\n"
            };
            let user_output_str = String::from_utf8(user_output.data).unwrap();
            let passed = user_output_str == expected_output;
            if passed {
                total_passed += 1;
            }
            let diff = get_diff_of_lines(user_output_str.as_str(), &expected_output);
            outputs.push(TestCaseResultUnion::Result(TestCaseSuccessStatus {
                passed,
                user_output: user_output_str,
                expected_output,
                diff,
                time: ExecuteCodeTime {
                    compilation: compiled_wasm.elapsed.clone(),
                    execution: user_output.elapsed,
                },
            }));
        }
        Ok(ExecuteCodeForQuestionOutput {
            num_test_cases: outputs.len() as u8,
            num_test_cases_failed: total_passed,
            test_case_statuses: outputs,
        })
    }

    pub async fn add_user_to_class(&self, hanko_id: &str, class_id: &Uuid) -> bool {
        let user_details = get_user_details_from_hanko_id(hanko_id, &self.db_conn)
            .await
            .unwrap();
        let mut teachers_to_add = vec![];
        let mut students_to_add = vec![];
        if matches!(user_details.account_type, AccountType::Teacher) {
            teachers_to_add.push(user_details.id);
        } else {
            students_to_add.push(user_details.id);
        }
        self.db_conn
            .query_required_single_json(
                ASSOCIATE_USERS_WITH_CLASS,
                &(class_id, teachers_to_add, students_to_add),
            )
            .await
            .map(|_| true)
            .map_err(|e| {
                log_error_and_return_api_error(
                    e,
                    "There was an error associating users with the class",
                );
                false
            })
            .unwrap()
    }
}
