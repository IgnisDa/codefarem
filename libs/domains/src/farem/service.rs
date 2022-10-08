use std::sync::Arc;

use async_graphql::Enum;
use async_trait::async_trait;
use edgedb_tokio::Client as DbClient;
use protobuf::generated::compilers::{
    compiler_service_client::CompilerServiceClient, Input, VoidParams,
};
use strum::{EnumIter, IntoEnumIterator};
use surf::Client as HttpClient;
use tonic::{transport::Channel, Request};

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

    //
    pub cpp_compiler_service: CompilerServiceClient<Channel>,
    pub go_compiler_service: CompilerServiceClient<Channel>,
    pub rust_compiler_service: CompilerServiceClient<Channel>,
}

impl FaremService {
    pub fn new(
        db_conn: &Arc<DbClient>,
        execute_client: &Arc<HttpClient>,
        cpp_compiler_service: &CompilerServiceClient<Channel>,
        go_compiler_service: &CompilerServiceClient<Channel>,
        rust_compiler_service: &CompilerServiceClient<Channel>,
    ) -> Self {
        Self {
            db_conn: db_conn.clone(),
            execute_client: execute_client.clone(),
            cpp_compiler_service: cpp_compiler_service.clone(),
            go_compiler_service: go_compiler_service.clone(),
            rust_compiler_service: rust_compiler_service.clone(),
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
        compiler_service: &CompilerServiceClient<Channel>,
    ) -> Result<Vec<u8>, String> {
        let a = compiler_service
            .clone()
            .compile_code(Input {
                code: input.to_string(),
            })
            .await;
        match a {
            Ok(s) => {
                let wasm = s.get_ref().data.clone();
                Ok(wasm)
            }
            Err(e) => {
                let error = e.message().to_string();
                Err(error)
            }
        }
    }
}

#[async_trait]
impl FaremServiceTrait for FaremService {
    fn supported_languages(&self) -> Vec<SupportedLanguage> {
        SupportedLanguage::variants()
    }

    async fn language_example(&self, language: &SupportedLanguage) -> String {
        let compiler_service = match language {
            SupportedLanguage::Rust => &self.rust_compiler_service,
            SupportedLanguage::Cpp => &self.cpp_compiler_service,
            SupportedLanguage::Go => &self.go_compiler_service,
        };
        compiler_service
            .clone()
            .example_code(Request::new(VoidParams {}))
            .await
            .unwrap()
            .get_ref()
            .data
            .clone()
    }

    async fn execute_code(
        &self,
        input: &'_ str,
        language: &SupportedLanguage,
    ) -> Result<ExecuteCodeOutput, ExecuteCodeError> {
        let wasm = match language {
            SupportedLanguage::Rust => {
                self.compile_source(input, &self.rust_compiler_service)
                    .await
            }
            SupportedLanguage::Cpp => self.compile_source(input, &self.cpp_compiler_service).await,
            SupportedLanguage::Go => self.compile_source(input, &self.go_compiler_service).await,
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
