use std::{io::Write, sync::Arc};

use async_graphql::Enum;
use async_trait::async_trait;
use duct::cmd;
use edgedb_tokio::Client as DbClient;
use serde_json::json;
use surf::Client as HttpClient;
use tempfile::Builder;

#[async_trait]
pub trait FaremServiceTrait: Sync + Send {
    /// Get all supported langauges
    fn supported_languages(&self) -> Vec<SupportedLanguage>;

    /// Compile and execute a Rust source.
    // Currently does not support user inputs.
    async fn compile_rust(&self, input: String) -> String;
}

pub struct FaremService {
    pub db_conn: Arc<DbClient>,
    pub farem_client: Arc<HttpClient>,
}

impl FaremService {
    pub fn new(db_conn: &Arc<DbClient>, farem_client: &Arc<HttpClient>) -> Self {
        Self {
            db_conn: db_conn.clone(),
            farem_client: farem_client.clone(),
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

    async fn compile_rust(&self, input: String) -> String {
        let mut s = self
            .farem_client
            .post("/farem")
            .body_json(&json!({ "rust": input }))
            .unwrap()
            .await
            .unwrap();
        let wasm = s.body_bytes().await.unwrap();
        let mut named_tempfile = Builder::new()
            .suffix(".wasm")
            .rand_bytes(5)
            .tempfile()
            .unwrap();
        named_tempfile.write_all(wasm.as_slice()).unwrap();
        let stdout = cmd!("wasmtime", named_tempfile.path()).read().unwrap();
        named_tempfile.close().unwrap();
        stdout
    }
}
