use super::dto::{
    mutations::{
        create_class::CreateClassOutput,
        create_question::CreateQuestionOutput,
        execute_code_for_question::{ExecuteCodeForQuestionOutput, TestCaseStatus},
    },
    queries::{
        class_details::ClassDetailsOutput,
        question_details::QuestionDetailsOutput,
        test_case::{TestCase, TestCaseUnit},
    },
};
use crate::{
    farem::{
        dto::mutations::execute_code::{ExecuteCodeError, ExecuteCodeErrorStep},
        service::{FaremService, SupportedLanguage},
    },
    utils::case_unit_to_argument,
};
use auth::validate_user_role;
use comrak::{markdown_to_html, ComrakOptions};
use edgedb_tokio::Client;
use std::sync::Arc;
use strum::IntoEnumIterator;
use utilities::{graphql::ApiError, models::IdObject, random_string, users::AccountType};
use uuid::Uuid;

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
        let mut question = serde_json::from_str::<QuestionDetailsOutput>(&question_model).unwrap();
        question.rendered_problem = markdown_to_html(&question.problem, &ComrakOptions::default());
        Ok(question)
    }

    pub async fn create_class<'a>(
        &self,
        hanko_id: &'a str,
        account_type: &AccountType,
        name: &'a str,
        teacher_ids: &[Uuid],
    ) -> Result<CreateClassOutput, ApiError> {
        validate_user_role(&AccountType::Teacher, account_type)?;
        let all_teachers_to_insert = teacher_ids.to_vec();
        // TODO: Insert correct teacher
        // all_teachers_to_insert.push(*hanko_id);
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
        account_type: &AccountType,
        name: &'a str,
        problem: &'a str,
        test_cases: &[TestCase],
        class_ids: &[Uuid],
    ) -> Result<CreateQuestionOutput, ApiError> {
        validate_user_role(&AccountType::Teacher, account_type)?;
        // FIXME: Insert correct teachers
        // let all_teachers_to_insert = vec![*hanko_id];
        let all_teachers_to_insert: Vec<Uuid> = vec![];
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
    ) -> Result<ExecuteCodeForQuestionOutput, ExecuteCodeError> {
        let question_details = self
            .question_details(question_slug)
            .await
            .expect("There was an error in getting the correct question");
        let compiled_wasm = self
            .farem_service
            .compile_source(code, language)
            .await
            .map_err(|f| ExecuteCodeError {
                error: f,
                step: ExecuteCodeErrorStep::CompilationToWasm,
            })?;
        let mut outputs = Vec::with_capacity(question_details.test_cases.len());
        for test_case in question_details.test_cases.iter() {
            let arguments = test_case
                .inputs
                .iter()
                .map(case_unit_to_argument)
                .collect::<Vec<_>>();
            let user_output = self
                .farem_service
                .send_execute_wasm_request(&compiled_wasm, &arguments)
                .await
                .map_err(|f| ExecuteCodeError {
                    error: f,
                    step: ExecuteCodeErrorStep::WasmExecution,
                })?;
            let expected_output = test_case
                .outputs
                .iter()
                .map(case_unit_to_argument)
                .collect::<Vec<_>>()
                .join("\n")
                + "\n";
            outputs.push(TestCaseStatus {
                passed: user_output == expected_output,
                user_output,
                expected_output,
            });
        }
        Ok(ExecuteCodeForQuestionOutput {
            num_test_cases: outputs.len() as u8,
            num_test_cases_failed: outputs.iter().filter(|&x| !x.passed).count() as u8,
            test_case_statuses: outputs,
        })
    }
}
