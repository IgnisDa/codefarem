use std::sync::Arc;

use async_graphql::Enum;
use async_trait::async_trait;
use edgedb_tokio::Client as DbClient;
use serde_json::json;
use strum::{EnumIter, IntoEnumIterator};
use surf::Client as HttpClient;

use super::dto::mutations::execute_code::{
    ExecuteCodeError, ExecuteCodeErrorStep, ExecuteCodeOutput,
};

#[async_trait]
pub trait FaremServiceTrait: Sync + Send {
    fn supported_languages(&self) -> Vec<SupportedLanguage>;

    async fn language_example(&self, language: &SupportedLanguage) -> String;

    async fn execute_code(
        &self,
        input: &'_ str,
        language: &SupportedLanguage,
    ) -> Result<ExecuteCodeOutput, ExecuteCodeError>;
}

pub struct FaremService {
    pub db_conn: Arc<DbClient>,
    pub execute_client: Arc<HttpClient>,
    pub rust_farem_client: Arc<HttpClient>,
    pub cpp_farem_client: Arc<HttpClient>,
    pub go_farem_client: Arc<HttpClient>,
}

impl FaremService {
    pub fn new(
        db_conn: &Arc<DbClient>,
        execute_client: &Arc<HttpClient>,
        rust_farem_client: &Arc<HttpClient>,
        cpp_farem_client: &Arc<HttpClient>,
        go_farem_client: &Arc<HttpClient>,
    ) -> Self {
        Self {
            db_conn: db_conn.clone(),
            execute_client: execute_client.clone(),
            rust_farem_client: rust_farem_client.clone(),
            cpp_farem_client: cpp_farem_client.clone(),
            go_farem_client: go_farem_client.clone(),
        }
    }
}

#[derive(Enum, Clone, Copy, PartialEq, Eq, EnumIter)]
#[graphql(rename_items = "lowercase")]
pub enum SupportedLanguage {
    Rust,
    Go,
    Cpp,
}

impl SupportedLanguage {
    fn variants() -> Vec<Self> {
        Self::iter().collect()
    }
}

impl FaremService {
    async fn execute_wasm(&self, wasm: Vec<u8>) -> Result<String, String> {
        self.execute_client
            .post("/execute")
            .body_bytes(wasm)
            .recv_string()
            .await
            .map_err(|f| f.to_string())
    }

    async fn compile_source(
        &self,
        input: &'_ str,
        client: &Arc<HttpClient>,
    ) -> Result<Vec<u8>, String> {
        let mut response = client
            .post("/farem")
            .body_json(&json!({ "code": input }))
            .unwrap()
            .await
            .unwrap();
        let response_body = response.body_bytes().await.unwrap();
        if response.status().is_client_error() {
            Err(String::from_utf8(response_body).unwrap())
        } else {
            Ok(response_body)
        }
    }
}

#[async_trait]
impl FaremServiceTrait for FaremService {
    fn supported_languages(&self) -> Vec<SupportedLanguage> {
        SupportedLanguage::variants()
    }

    async fn language_example(&self, language: &SupportedLanguage) -> String {
        let farem_client = match language {
            SupportedLanguage::Rust => &self.rust_farem_client,
            SupportedLanguage::Cpp => &self.cpp_farem_client,
            SupportedLanguage::Go => &self.go_farem_client,
        };
        farem_client
            .get("/example")
            .await
            .unwrap()
            .body_string()
            .await
            .unwrap()
    }

    async fn execute_code(
        &self,
        input: &'_ str,
        language: &SupportedLanguage,
    ) -> Result<ExecuteCodeOutput, ExecuteCodeError> {
        let wasm = match language {
            SupportedLanguage::Rust => self.compile_source(input, &self.rust_farem_client).await,
            SupportedLanguage::Cpp => self.compile_source(input, &self.cpp_farem_client).await,
            SupportedLanguage::Go => self.compile_source(input, &self.go_farem_client).await,
        }
        .map_err(|f| ExecuteCodeError {
            error: f,
            step: ExecuteCodeErrorStep::CompilationToWasm,
        })?;
        self.execute_wasm(wasm)
            .await
            .map(|f| ExecuteCodeOutput { output: f })
            .map_err(|f| ExecuteCodeError {
                error: f,
                step: ExecuteCodeErrorStep::WasmExecution,
            })
    }
}
