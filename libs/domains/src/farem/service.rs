use std::sync::Arc;

use async_graphql::Enum;
use async_trait::async_trait;
use edgedb_tokio::Client;

pub trait FaremServiceTrait: Sync + Send {
    /// Get all supported langauges
    fn supported_languages(&self) -> Vec<SupportedLanguage>;
}

pub struct FaremService {
    pub db_conn: Arc<Client>,
}

impl FaremService {
    pub fn new(db_conn: &Arc<Client>) -> Self {
        Self {
            db_conn: db_conn.clone(),
        }
    }
}

#[derive(Enum, Clone, Copy, PartialEq, Eq)]
pub enum SupportedLanguage {
    Rust,
}

impl SupportedLanguage {
    fn variants() -> Vec<Self> {
        vec![Self::Rust]
    }
}

#[async_trait]
impl FaremServiceTrait for FaremService {
    fn supported_languages(&self) -> Vec<SupportedLanguage> {
        SupportedLanguage::variants()
    }
}
