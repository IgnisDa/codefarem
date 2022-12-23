use crate::farem::{
    dto::{
        mutations::execute_code::{ExecuteCodeInput, ExecuteCodeResultUnion},
        queries::toolchain_information::ToolChainInformation,
    },
    service::FaremService,
};
use async_graphql::{Context, Object, Result};
use macros::to_result_union_response;
use utilities::SupportedLanguage;

/// The query segment for Farem
#[derive(Default)]
pub struct FaremQuery {}

/// The mutation segment for Farem
#[derive(Default)]
pub struct FaremMutation {}

#[Object]
impl FaremQuery {
    /// Endpoint to get all toolchain information
    // can use parallel iteration to get the data from all services and store it in a
    // global variable (caching for later uses). Read:
    // https://github.com/paulkernfeld/global-data-in-rust
    async fn toolchain_information(&self, ctx: &Context<'_>) -> Vec<ToolChainInformation> {
        ctx.data_unchecked::<FaremService>().toolchain_information()
    }

    /// Get a list of all the languages that the service supports.
    async fn supported_languages(&self, ctx: &Context<'_>) -> Vec<SupportedLanguage> {
        ctx.data_unchecked::<FaremService>().supported_languages()
    }

    /// Get an example code snippet for a particular language
    async fn language_example(&self, ctx: &Context<'_>, language: SupportedLanguage) -> String {
        ctx.data_unchecked::<FaremService>()
            .language_example(&language)
            .await
    }
}

#[Object]
impl FaremMutation {
    /// Takes some code as input and compiles it to wasm before executing it with the
    /// supplied argument
    async fn execute_code(
        &self,
        ctx: &Context<'_>,
        input: ExecuteCodeInput,
    ) -> Result<ExecuteCodeResultUnion> {
        let output = ctx
            .data_unchecked::<FaremService>()
            .execute_code(input.code(), input.arguments(), input.language())
            .await;
        to_result_union_response!(output, ExecuteCodeResultUnion)
    }
}
