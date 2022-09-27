use std::{io::Write, path::PathBuf, sync::Arc};

use async_graphql::Enum;
use async_trait::async_trait;
use duct::cmd;
use edgedb_tokio::Client as DbClient;
use serde_json::json;
use surf::Client as HttpClient;

use crate::utils::generate_random_file;

#[async_trait]
pub trait FaremServiceTrait: Sync + Send {
    fn supported_languages(&self) -> Vec<SupportedLanguage>;

    async fn language_example(&self, language: SupportedLanguage) -> String;

    async fn execute_code(&self, input: String, language: SupportedLanguage) -> String;
}

pub struct FaremService {
    pub db_conn: Arc<DbClient>,
    pub rust_farem_client: Arc<HttpClient>,
    pub cpp_farem_client: Arc<HttpClient>,
    pub go_farem_client: Arc<HttpClient>,
}

impl FaremService {
    pub fn new(
        db_conn: &Arc<DbClient>,
        rust_farem_client: &Arc<HttpClient>,
        cpp_farem_client: &Arc<HttpClient>,
        go_farem_client: &Arc<HttpClient>,
    ) -> Self {
        Self {
            db_conn: db_conn.clone(),
            rust_farem_client: rust_farem_client.clone(),
            cpp_farem_client: cpp_farem_client.clone(),
            go_farem_client: go_farem_client.clone(),
        }
    }
}

#[derive(Enum, Clone, Copy, PartialEq, Eq)]
#[graphql(rename_items = "lowercase")]
pub enum SupportedLanguage {
    Rust,
    Go,
    Cpp,
}

impl SupportedLanguage {
    fn variants() -> Vec<Self> {
        vec![Self::Rust, Self::Go, Self::Cpp]
    }
}

impl FaremService {
    fn execute_wasm(&self, path: &PathBuf) -> String {
        cmd!("wasmtime", path).read().unwrap()
    }

    async fn compile_source(&self, input: String, client: &Arc<HttpClient>) -> Vec<u8> {
        let mut s = client
            .post("/farem")
            .body_json(&json!({ "code": input }))
            .unwrap()
            .await
            .unwrap();
        s.body_bytes().await.unwrap()
    }

    fn write_wasm_to_temp_file(&self, wasm: Vec<u8>) -> PathBuf {
        let (mut file, file_path) = generate_random_file(Some("wasm")).unwrap();
        file.write_all(wasm.as_slice()).unwrap();
        file_path
    }

    async fn compile_rust(&self, input: String) -> String {
        let wasm = self.compile_source(input, &self.rust_farem_client).await;
        let path = self.write_wasm_to_temp_file(wasm);
        self.execute_wasm(&path)
    }

    async fn compile_cpp(&self, input: String) -> String {
        let wasm = self.compile_source(input, &self.cpp_farem_client).await;
        let path = self.write_wasm_to_temp_file(wasm);
        self.execute_wasm(&path)
    }

    async fn compile_go(&self, input: String) -> String {
        let wasm = self.compile_source(input, &self.go_farem_client).await;
        let path = self.write_wasm_to_temp_file(wasm);
        self.execute_wasm(&path)
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
            SupportedLanguage::Cpp => &self.cpp_farem_client,
            SupportedLanguage::Go => &self.go_farem_client,
        };
        farem_client
            .get("/example")
            .await
            .unwrap()
            .body_string()
            .await
            .unwrap()
    }

    async fn execute_code(&self, input: String, language: SupportedLanguage) -> String {
        match language {
            SupportedLanguage::Rust => self.compile_rust(input).await,
            SupportedLanguage::Cpp => self.compile_cpp(input).await,
            SupportedLanguage::Go => self.compile_go(input).await,
        }
    }
}
