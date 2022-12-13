use anyhow::Result;
use dotenv::dotenv;
use edgedb_tokio::Client;
use protobuf::generated::{
    compilers::compiler_service_client::CompilerServiceClient,
    executor::executor_service_client::ExecutorServiceClient,
};
use serde::Deserialize;
use std::sync::Arc;
use tonic::transport::Channel;
use utilities::get_figment_config;

#[derive(Debug, Deserialize)]
pub struct ServiceConfig {
    pub executor: String,
    pub cpp_compiler: String,
    pub go_compiler: String,
    pub rust_compiler: String,
    pub authenticator: String,
}

#[derive(Debug, Deserialize)]
pub struct AppConfig {
    pub service_urls: ServiceConfig,
}

pub struct AppState {
    pub db_conn: Arc<Client>,
    pub executor_service: ExecutorServiceClient<Channel>,
    pub cpp_compiler_service: CompilerServiceClient<Channel>,
    pub go_compiler_service: CompilerServiceClient<Channel>,
    pub rust_compiler_service: CompilerServiceClient<Channel>,
    pub config: AppConfig,
}

impl AppState {
    pub async fn new() -> Result<Self> {
        let db_conn = edgedb_tokio::create_client().await?;
        db_conn
            .ensure_connected()
            .await
            .expect("Unable to connect to the edgedb instance");

        let config: AppConfig = get_figment_config().extract()?;

        let executor_service =
            ExecutorServiceClient::connect(config.service_urls.executor.clone()).await?;
        let cpp_compiler_service =
            CompilerServiceClient::connect(config.service_urls.cpp_compiler.clone()).await?;
        let go_compiler_service =
            CompilerServiceClient::connect(config.service_urls.go_compiler.clone()).await?;
        let rust_compiler_service =
            CompilerServiceClient::connect(config.service_urls.rust_compiler.clone()).await?;

        Ok(Self {
            db_conn: Arc::new(db_conn),
            executor_service,
            cpp_compiler_service,
            go_compiler_service,
            rust_compiler_service,
            config,
        })
    }
}

pub async fn get_app_state() -> Result<AppState> {
    dotenv().ok();
    AppState::new().await
}
