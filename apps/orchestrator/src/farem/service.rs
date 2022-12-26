use crate::{
    farem::dto::{
        mutations::execute_code::{
            ExecuteCodeError, ExecuteCodeErrorStep, ExecuteCodeOutput, ExecuteCodeTime,
        },
        queries::toolchain_information::ToolChainInformation,
    },
    learning::dto::queries::test_case::InputCaseUnit,
};
use once_cell::sync::OnceCell;
use protobuf::generated::{
    executor::{executor_service_client::ExecutorServiceClient, ExecutorInput, Language},
    languages::{compiler_service_client::CompilerServiceClient, Input, VoidParams},
};
use tokio::task::JoinSet;
use tonic::{transport::Channel, Request};
use utilities::SupportedLanguage;

static TOOLCHAIN_INFORMATION: OnceCell<Vec<ToolChainInformation>> = OnceCell::new();

#[derive(Debug, Clone)]
pub struct StepResult {
    pub data: Vec<u8>,
    pub elapsed: String,
}

#[derive(Debug, Clone)]
pub struct FaremService {
    executor_service: ExecutorServiceClient<Channel>,
    cpp_service: CompilerServiceClient<Channel>,
    go_service: CompilerServiceClient<Channel>,
    rust_service: CompilerServiceClient<Channel>,
    zig_service: CompilerServiceClient<Channel>,
    c_service: CompilerServiceClient<Channel>,
    swift_service: CompilerServiceClient<Channel>,
    python_service: CompilerServiceClient<Channel>,
    ruby_service: CompilerServiceClient<Channel>,
    grain_service: CompilerServiceClient<Channel>,
}

impl FaremService {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        executor_service: &ExecutorServiceClient<Channel>,
        cpp_service: &CompilerServiceClient<Channel>,
        go_service: &CompilerServiceClient<Channel>,
        rust_service: &CompilerServiceClient<Channel>,
        zig_service: &CompilerServiceClient<Channel>,
        c_service: &CompilerServiceClient<Channel>,
        python_service: &CompilerServiceClient<Channel>,
        swift_service: &CompilerServiceClient<Channel>,
        ruby_service: &CompilerServiceClient<Channel>,
        grain_service: &CompilerServiceClient<Channel>,
    ) -> Self {
        Self {
            executor_service: executor_service.clone(),
            cpp_service: cpp_service.clone(),
            go_service: go_service.clone(),
            rust_service: rust_service.clone(),
            zig_service: zig_service.clone(),
            c_service: c_service.clone(),
            python_service: python_service.clone(),
            swift_service: swift_service.clone(),
            ruby_service: ruby_service.clone(),
            grain_service: grain_service.clone(),
        }
    }

    fn service_from_language(
        &self,
        language: &SupportedLanguage,
    ) -> &CompilerServiceClient<Channel> {
        match language {
            SupportedLanguage::Rust => &self.rust_service,
            SupportedLanguage::Go => &self.go_service,
            SupportedLanguage::C => &self.c_service,
            SupportedLanguage::Cpp => &self.cpp_service,
            SupportedLanguage::Zig => &self.zig_service,
            SupportedLanguage::Python => &self.python_service,
            SupportedLanguage::Swift => &self.swift_service,
            SupportedLanguage::Ruby => &self.ruby_service,
            SupportedLanguage::Grain => &self.grain_service,
        }
    }

    pub async fn initialize(&self) {
        let mut set = JoinSet::new();
        for language in self.supported_languages().into_iter() {
            let compiler_service = self.service_from_language(&language).clone();
            set.spawn(async move {
                let tf = compiler_service
                    .clone()
                    .toolchain_info(Request::new(VoidParams {}))
                    .await
                    .map_err(|f| {
                        println!("Error: {:?} for language: {:?}", f, language);
                    })
                    .unwrap()
                    .into_inner();
                ToolChainInformation {
                    version: tf.version,
                    service: language,
                    language_logo: tf.language_logo,
                }
            });
        }
        let mut toolchain_information = vec![];
        while let Some(result) = set.join_next().await {
            toolchain_information.push(result.unwrap());
        }
        toolchain_information.sort_by(|a, b| a.version.cmp(&b.version));
        TOOLCHAIN_INFORMATION
            .set(toolchain_information)
            .expect("Toolchain information already initialized");
    }
}

impl FaremService {
    pub fn toolchain_information(&self) -> Vec<ToolChainInformation> {
        TOOLCHAIN_INFORMATION
            .get()
            .expect("Toolchain information not initialized")
            .clone()
    }

    pub async fn send_execute_wasm_request(
        &self,
        wasm: &[u8],
        arguments: &[String],
        language: &SupportedLanguage,
    ) -> Result<StepResult, String> {
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
            Ok(s) => Ok(StepResult {
                data: s.get_ref().data.clone(),
                elapsed: s.get_ref().elapsed.clone(),
            }),
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
    ) -> Result<StepResult, String> {
        let compiler_service = self.service_from_language(language);
        self.send_compile_source_request(source, compiler_service)
            .await
    }

    pub async fn send_compile_source_request(
        &self,
        input: &'_ str,
        compiler_service: &CompilerServiceClient<Channel>,
    ) -> Result<StepResult, String> {
        let compile_result = compiler_service
            .clone()
            .compile_code(Input {
                code: input.to_string(),
            })
            .await;
        match compile_result {
            Ok(s) => Ok(StepResult {
                data: s.get_ref().data.clone(),
                elapsed: s.get_ref().elapsed.clone(),
            }),
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
        let compiler_service = self.service_from_language(language);
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
        arguments: &[InputCaseUnit],
        language: &SupportedLanguage,
    ) -> Result<ExecuteCodeOutput, ExecuteCodeError> {
        let compilation =
            self.compile_source(input, language)
                .await
                .map_err(|f| ExecuteCodeError {
                    error: f,
                    step: ExecuteCodeErrorStep::CompilationToWasm,
                })?;
        let sanitized_args = arguments.iter().map(|f| f.data.clone()).collect::<Vec<_>>();
        self.send_execute_wasm_request(&compilation.data, &sanitized_args, language)
            .await
            .map(|f| ExecuteCodeOutput {
                output: String::from_utf8(f.data).unwrap(),
                time: ExecuteCodeTime {
                    compilation: compilation.elapsed,
                    execution: f.elapsed,
                },
            })
            .map_err(|f| ExecuteCodeError {
                error: f,
                step: ExecuteCodeErrorStep::WasmExecution,
            })
    }
}
