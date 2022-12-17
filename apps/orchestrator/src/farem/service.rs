use crate::farem::dto::mutations::execute_code::{
    ExecuteCodeError, ExecuteCodeErrorStep, ExecuteCodeOutput,
};
use async_graphql::Enum;
use protobuf::generated::{
    compilers::{compiler_service_client::CompilerServiceClient, Input, VoidParams},
    executor::{executor_service_client::ExecutorServiceClient, ExecutorInput},
};
use strum::{EnumIter, IntoEnumIterator};
use tonic::{transport::Channel, Request};

#[derive(Debug, Clone)]
pub struct FaremService {
    executor_service: ExecutorServiceClient<Channel>,
    cpp_compiler_service: CompilerServiceClient<Channel>,
    go_compiler_service: CompilerServiceClient<Channel>,
    rust_compiler_service: CompilerServiceClient<Channel>,
    zig_compiler_service: CompilerServiceClient<Channel>,
    c_compiler_service: CompilerServiceClient<Channel>,
}

impl FaremService {
    pub fn new(
        executor_service: &ExecutorServiceClient<Channel>,
        cpp_compiler_service: &CompilerServiceClient<Channel>,
        go_compiler_service: &CompilerServiceClient<Channel>,
        rust_compiler_service: &CompilerServiceClient<Channel>,
        zig_compiler_service: &CompilerServiceClient<Channel>,
        c_compiler_service: &CompilerServiceClient<Channel>,
    ) -> Self {
        Self {
            executor_service: executor_service.clone(),
            cpp_compiler_service: cpp_compiler_service.clone(),
            go_compiler_service: go_compiler_service.clone(),
            rust_compiler_service: rust_compiler_service.clone(),
            zig_compiler_service: zig_compiler_service.clone(),
            c_compiler_service: c_compiler_service.clone(),
        }
    }
}

#[derive(Enum, Clone, Copy, Debug, PartialEq, Eq, EnumIter)]
#[graphql(rename_items = "lowercase")]
pub enum SupportedLanguage {
    Rust,
    Go,
    Cpp,
    C,
    Zig,
}

impl SupportedLanguage {
    fn variants() -> Vec<Self> {
        Self::iter().collect()
    }
}

impl FaremService {
    pub async fn send_execute_wasm_request(
        &self,
        wasm: &[u8],
        arguments: &[String],
    ) -> Result<String, String> {
        let execute_result = self
            .executor_service
            .clone()
            .execute(ExecutorInput {
                data: wasm.to_vec(),
                arguments: arguments.to_vec(),
            })
            .await;
        match execute_result {
            Ok(s) => {
                let wasm = String::from_utf8(s.get_ref().data.clone()).unwrap();
                Ok(wasm)
            }
            Err(e) => {
                let error = e.message().to_string();
                Err(error)
            }
        }
    }

    pub async fn compile_source(
        &self,
        source: &str,
        language: &SupportedLanguage,
    ) -> Result<Vec<u8>, String> {
        let compiler_service = match language {
            SupportedLanguage::Rust => &self.rust_compiler_service,
            SupportedLanguage::Go => &self.go_compiler_service,
            SupportedLanguage::C => &self.c_compiler_service,
            SupportedLanguage::Cpp => &self.cpp_compiler_service,
            SupportedLanguage::Zig => &self.zig_compiler_service,
        };
        self.send_compile_source_request(source, compiler_service)
            .await
    }

    pub async fn send_compile_source_request(
        &self,
        input: &'_ str,
        compiler_service: &CompilerServiceClient<Channel>,
    ) -> Result<Vec<u8>, String> {
        let compile_result = compiler_service
            .clone()
            .compile_code(Input {
                code: input.to_string(),
            })
            .await;
        match compile_result {
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

    pub fn supported_languages(&self) -> Vec<SupportedLanguage> {
        SupportedLanguage::variants()
    }

    pub async fn language_example(&self, language: &SupportedLanguage) -> String {
        let compiler_service = match language {
            SupportedLanguage::Rust => &self.rust_compiler_service,
            SupportedLanguage::Cpp => &self.cpp_compiler_service,
            SupportedLanguage::C => &self.c_compiler_service,
            SupportedLanguage::Go => &self.go_compiler_service,
            SupportedLanguage::Zig => &self.zig_compiler_service,
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

    pub async fn execute_code(
        &self,
        input: &'_ str,
        arguments: &[String],
        language: &SupportedLanguage,
    ) -> Result<ExecuteCodeOutput, ExecuteCodeError> {
        let wasm = self
            .compile_source(input, language)
            .await
            .map_err(|f| ExecuteCodeError {
                error: f,
                step: ExecuteCodeErrorStep::CompilationToWasm,
            })?;
        self.send_execute_wasm_request(&wasm, arguments)
            .await
            .map(|f| ExecuteCodeOutput { output: f })
            .map_err(|f| ExecuteCodeError {
                error: f,
                step: ExecuteCodeErrorStep::WasmExecution,
            })
    }
}
