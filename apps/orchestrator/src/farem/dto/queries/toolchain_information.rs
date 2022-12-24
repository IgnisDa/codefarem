use async_graphql::SimpleObject;
use utilities::SupportedLanguage;

#[derive(Debug, Clone, SimpleObject)]
pub struct ToolChainInformation {
    pub service: SupportedLanguage,
    pub version: String,
    // A base64 encoded image
    pub language_logo: String,
}
