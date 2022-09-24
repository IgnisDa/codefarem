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
    fn supported_languages(&self) -> Vec<SupportedLanguage>;

    async fn language_example(&self, language: SupportedLanguage) -> String;

    async fn compile_rust(&self, input: String) -> String;

    async fn execute_code(&self, input: String, language: SupportedLanguage) -> String;
}

pub struct FaremService {
    pub db_conn: Arc<DbClient>,
    pub rust_farem_client: Arc<HttpClient>,
}

impl FaremService {
    pub fn new(db_conn: &Arc<DbClient>, rust_farem_client: &Arc<HttpClient>) -> Self {
        Self {
            db_conn: db_conn.clone(),
            rust_farem_client: rust_farem_client.clone(),
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

    async fn language_example(&self, language: SupportedLanguage) -> String {
        let farem_client = match language {
            SupportedLanguage::Rust => &self.rust_farem_client,
        };
        farem_client
            .get("/example")
            .await
            .unwrap()
            .body_string()
            .await
            .unwrap()
    }

    async fn compile_rust(&self, input: String) -> String {
        let mut s = self
            .rust_farem_client
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

    async fn execute_code(&self, input: String, language: SupportedLanguage) -> String {
        match language {
            SupportedLanguage::Rust => self.compile_rust(input).await,
        }
    }
}
