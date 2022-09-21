use anyhow::{Ok, Result};
use async_graphql::{Context, Object};

use super::service::{FaremService, FaremServiceTrait, SupportedLanguage};

/// The Query segment for Farem
#[derive(Default)]
pub struct FaremQuery {}

#[Object]
impl FaremQuery {
    /// Get a list of all the languages that the service supports.
    async fn supported_languages(&self, ctx: &Context<'_>) -> Vec<SupportedLanguage> {
        ctx.data::<FaremService>().unwrap().supported_languages()
    }

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
