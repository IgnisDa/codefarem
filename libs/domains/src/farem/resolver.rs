use anyhow::{Ok, Result};
use async_graphql::{Context, Object};

use super::service::{FaremService, FaremServiceTrait, SupportedLanguage};

/// The query segment for Farem
#[derive(Default)]
pub struct FaremQuery {}

/// The mutation segment for Farem
#[derive(Default)]
pub struct FaremMutation {}

#[Object]
impl FaremQuery {
    /// Get a list of all the languages that the service supports.
    async fn supported_languages(&self, ctx: &Context<'_>) -> Vec<SupportedLanguage> {
        ctx.data::<FaremService>().unwrap().supported_languages()
    }

    /// Get an example code snippet for a particular language
    async fn language_example(&self, ctx: &Context<'_>, language: SupportedLanguage) -> String {
        ctx.data::<FaremService>()
            .unwrap()
            .language_example(language)
            .await
    }
}

#[Object]
impl FaremMutation {
    /// Compile a rust source and execute it.
    // Currently does not support user inputs.
    async fn compile_rust(&self, ctx: &Context<'_>, input: String) -> Result<String> {
        let output = ctx
            .data::<FaremService>()
            .unwrap()
            .compile_rust(input)
            .await;
        Ok(output)
    }
}
