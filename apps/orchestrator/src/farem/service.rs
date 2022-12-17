use crate::farem::dto::mutations::execute_code::{
    ExecuteCodeError, ExecuteCodeErrorStep, ExecuteCodeOutput,
};
use protobuf::generated::{
    compilers::{compiler_service_client::CompilerServiceClient, Input, VoidParams},
    executor::{executor_service_client::ExecutorServiceClient, ExecutorInput, Language},
};
use tonic::{transport::Channel, Request};
use utilities::SupportedLanguage;

#[derive(Debug, Clone)]
pub struct FaremService {
    executor_service: ExecutorServiceClient<Channel>,
    cpp_service: CompilerServiceClient<Channel>,
    go_service: CompilerServiceClient<Channel>,
    rust_service: CompilerServiceClient<Channel>,
    zig_service: CompilerServiceClient<Channel>,
    c_service: CompilerServiceClient<Channel>,
    python_service: CompilerServiceClient<Channel>,
}

impl FaremService {
    pub fn new(
        executor_service: &ExecutorServiceClient<Channel>,
        cpp_service: &CompilerServiceClient<Channel>,
        go_service: &CompilerServiceClient<Channel>,
        rust_service: &CompilerServiceClient<Channel>,
        zig_service: &CompilerServiceClient<Channel>,
        c_service: &CompilerServiceClient<Channel>,
        python_service: &CompilerServiceClient<Channel>,
    ) -> Self {
        Self {
            executor_service: executor_service.clone(),
            cpp_service: cpp_service.clone(),
            go_service: go_service.clone(),
            rust_service: rust_service.clone(),
            zig_service: zig_service.clone(),
            c_service: c_service.clone(),
            python_service: python_service.clone(),
        }
    }
}

impl FaremService {
    pub async fn send_execute_wasm_request(
        &self,
        wasm: &[u8],
        arguments: &[String],
        language: &SupportedLanguage,
    ) -> Result<String, String> {
        let request_lang = Language::from(*language) as i32;
        let execute_result = self
            .executor_service
            .clone()
            .execute(ExecutorInput {
                data: wasm.to_vec(),
                arguments: arguments.to_vec(),
                language: request_lang,
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
            SupportedLanguage::Rust => &self.rust_service,
            SupportedLanguage::Go => &self.go_service,
            SupportedLanguage::C => &self.c_service,
            SupportedLanguage::Cpp => &self.cpp_service,
            SupportedLanguage::Zig => &self.zig_service,
            SupportedLanguage::Python => &self.python_service,
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
            SupportedLanguage::Rust => &self.rust_service,
            SupportedLanguage::Cpp => &self.cpp_service,
            SupportedLanguage::C => &self.c_service,
            SupportedLanguage::Go => &self.go_service,
            SupportedLanguage::Zig => &self.zig_service,
            SupportedLanguage::Python => &self.python_service,
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
        self.send_execute_wasm_request(&wasm, arguments, language)
            .await
            .map(|f| ExecuteCodeOutput { output: f })
            .map_err(|f| ExecuteCodeError {
                error: f,
                step: ExecuteCodeErrorStep::WasmExecution,
            })
    }
}
