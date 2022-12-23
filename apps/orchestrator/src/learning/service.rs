use crate::{
    farem::{
        dto::mutations::execute_code::{ExecuteCodeError, ExecuteCodeErrorStep, ExecuteCodeTime},
        service::FaremService,
    },
    learning::dto::{
        mutations::{
            create_class::CreateClassOutput,
            create_question::CreateQuestionOutput,
            execute_code_for_question::{
                ExecuteCodeForQuestionOutput, TestCaseResultUnion, TestCaseSuccessStatus,
            },
        },
        queries::{
            all_questions::QuestionPartialsDetails,
            class_details::ClassDetailsOutput,
            question_details::QuestionDetailsOutput,
            test_case::{TestCase, TestCaseUnit},
        },
    },
    utils::case_unit_to_argument,
};
use async_graphql::{
    connection::{query, Connection, Edge, EmptyFields},
    Error, Result,
};
use auth::validate_user_role;
use edgedb_derive::Queryable;
use edgedb_tokio::Client;
use std::sync::Arc;
use strum::IntoEnumIterator;
use utilities::{
    diff::get_diff_of_lines,
    graphql::ApiError,
    models::IdObject,
    random_string,
    users::{get_user_details_from_hanko_id, AccountType},
    SupportedLanguage,
};
use uuid::Uuid;

const PAGINATED_QUESTIONS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/paginated-questions.edgeql");
const IS_SLUG_NOT_UNIQUE: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/is-slug-not-unique.edgeql");
const QUESTION_DETAILS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/question-details.edgeql");
const CLASS_DETAILS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/class-details.edgeql");
const CREATE_CLASS: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/create-class.edgeql");
const CREATE_QUESTION: &str =
    include_str!("../../../../libs/main-db/edgeql/learning/create-question.edgeql");
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

pub struct LearningService {
    db_conn: Arc<Client>,
    farem_service: Arc<FaremService>,
}

impl LearningService {
    pub fn new(db_conn: &Arc<Client>, farem_service: &Arc<FaremService>) -> Self {
        Self {
            db_conn: db_conn.clone(),
            farem_service: farem_service.clone(),
        }
    }
}

impl LearningService {
    pub fn test_case_units(&self) -> Vec<TestCaseUnit> {
        TestCaseUnit::iter().collect()
    }

    pub async fn questions_connection<'a>(
        &self,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<String, QuestionPartialsDetails, EmptyFields, EmptyFields>> {
        query(
            after,
            before,
            first,
            last,
            |after, before, first, last| async move {
                // either first or last or default if not provided
                let limit = first.unwrap_or_else(|| last.unwrap_or(5)) as i16;

                let convert = |id: Option<String>| id.map(|id| Uuid::parse_str(&id).unwrap());
                let after = convert(after);
                let before = convert(before);

                #[derive(Debug, Queryable)]
                struct QueryResult {
                    selected: Vec<QuestionPartialsDetails>,
                    has_previous_page: bool,
                    has_next_page: bool,
                }

                let result = self
                    .db_conn
                    .query_required_single::<QueryResult, _>(
                        PAGINATED_QUESTIONS,
                        &(after, before, limit),
                    )
                    .await
                    .unwrap();

                let mut connection =
                    Connection::new(result.has_previous_page, result.has_next_page);
                connection
                    .edges
                    .extend(result.selected.into_iter().map(|question| {
                        Edge::with_additional_fields(question.id.to_string(), question, EmptyFields)
                    }));
                Ok::<_, Error>(connection)
            },
        )
        .await
    }

    pub async fn class_details<'a>(&self, class_id: Uuid) -> Result<ClassDetailsOutput, ApiError> {
        self.db_conn
            .query_required_single::<ClassDetailsOutput, _>(CLASS_DETAILS, &(class_id,))
            .await
            .map_err(|_| ApiError {
                error: format!("Class with id={class_id:?} not found"),
            })
    }

    pub async fn question_details<'a>(
        &self,
        question_slug: &'_ str,
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

    pub async fn create_class<'a>(
        &self,
        hanko_id: &'a str,
        name: &'a str,
        teacher_ids: &[Uuid],
    ) -> Result<CreateClassOutput, ApiError> {
        let user_details = get_user_details_from_hanko_id(hanko_id, &self.db_conn).await?;
        validate_user_role(&AccountType::Teacher, &user_details.account_type)?;
        let mut all_teachers_to_insert = teacher_ids.to_vec();
        all_teachers_to_insert.push(user_details.id);
        self.db_conn
            .query_required_single::<CreateClassOutput, _>(
                CREATE_CLASS,
                &(name, all_teachers_to_insert),
            )
            .await
            .map_err(|_| ApiError {
                error: "There was an error creating the class, please try again.".to_string(),
            })
    }

    pub async fn create_question<'a>(
        &self,
        hanko_id: &'a str,
        name: &'a str,
        problem: &'a str,
        test_cases: &[TestCase],
        class_ids: &[Uuid],
    ) -> Result<CreateQuestionOutput, ApiError> {
        let user_details = get_user_details_from_hanko_id(hanko_id, &self.db_conn).await?;
        validate_user_role(&AccountType::Teacher, &user_details.account_type)?;
        let all_teachers_to_insert = vec![user_details.id];
        let mut slug = random_string(8);
        loop {
            let is_slug_not_unique = self
                .db_conn
                .query_required_single::<bool, _>(IS_SLUG_NOT_UNIQUE, &(&slug,))
                .await
                .unwrap();
            if !is_slug_not_unique {
                break;
            }
            slug = random_string(8);
        }
        let class = self
            .db_conn
            .query_required_single::<CreateQuestionOutput, _>(
                CREATE_QUESTION,
                &(
                    name,
                    problem,
                    slug,
                    class_ids.to_vec(),
                    all_teachers_to_insert,
                ),
            )
            .await
            .map_err(|_| ApiError {
                error: "There was an error creating the question, please try again.".to_string(),
            })?;
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
                &(class.id, test_cases_to_associate),
            )
            .await
            .unwrap();
        Ok(class)
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
                .map(case_unit_to_argument)
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
            let expected_output = test_case
                .outputs
                .iter()
                .map(case_unit_to_argument)
                .collect::<Vec<_>>()
                .join("\n")
                + "\n";
            let user_output_str = String::from_utf8(user_output.data).unwrap();
            let passed = user_output_str == expected_output;
            if passed {
                total_passed += 1;
            }
            let diff = get_diff_of_lines(&expected_output, user_output_str.as_str());
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
}
