use async_graphql::{Enum, InputObject, SimpleObject, Union};
use derive_getters::Getters;
use utilities::SupportedLanguage;

/// The input object used to execute some code
#[derive(InputObject, Getters)]
pub struct ExecuteCodeInput {
    /// The code input that needs to be compiled
    code: String,

    /// The arguments to be passed to the execution engine
    arguments: Vec<String>,

    /// The language that needs to be compiled
    language: SupportedLanguage,
}

/// The time taken for the various steps
#[derive(Debug, SimpleObject)]
pub struct ExecuteCodeTime {
    /// The time taken to compile the code to wasm
    pub compilation: String,

    /// The time taken to execute the wasm
    pub execution: String,
}

/// The result type if the code was compiled and executed successfully
#[derive(Debug, SimpleObject)]
pub struct ExecuteCodeOutput {
    /// The output of the code that was executed
    pub output: String,

    /// The time taken for the various steps
    pub time: ExecuteCodeTime,
}

/// The execution step in which an error was encountered
#[derive(Debug, Enum, Clone, Copy, PartialEq, Eq)]
pub enum ExecuteCodeErrorStep {
    CompilationToWasm,
    WasmExecution,
}

/// The result type if an error was encountered when executing code
#[derive(Debug, SimpleObject)]
pub struct ExecuteCodeError {
    /// The error that occurred while compiling/executing the submitted code
    pub error: String,

    /// The step in which the error the above error occurred
    pub step: ExecuteCodeErrorStep,
}

/// The output object when executing code
#[derive(Debug, Union)]
pub enum ExecuteCodeResultUnion {
    /// The type returned if executing code was successful
    Result(ExecuteCodeOutput),

    /// The type returned if executing code was unsuccessful
    Error(ExecuteCodeError),
}
