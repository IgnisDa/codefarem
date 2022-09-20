use async_graphql::Enum;

pub struct CoreService;

#[derive(Enum, Clone, Copy, PartialEq, Eq)]

pub enum SupportedLanguage {
    Rust,
}

impl SupportedLanguage {
    fn variants() -> Vec<Self> {
        vec![Self::Rust]
    }
}

impl CoreService {
    pub fn supported_languages() -> Vec<SupportedLanguage> {
        SupportedLanguage::variants()
    }
}
