use anyhow::{Context, Result};
use dotenv::dotenv;
use edgedb_tokio::Client;
use protobuf::generated::{
    executor::executor_service_client::ExecutorServiceClient,
    languages::compiler_service_client::CompilerServiceClient,
};
use serde::Deserialize;
use std::sync::Arc;
use tonic::transport::Channel;
use utilities::get_figment_config;

#[derive(Debug, Deserialize)]
pub struct ServiceConfig {
    pub executor: String,
    pub c_service: String,
    pub cpp_service: String,
    pub go_service: String,
    pub python_service: String,
    pub ruby_service: String,
    pub rust_service: String,
    pub swift_service: String,
    pub grain_service: String,
    pub zig_service: String,
    pub authenticator: String,
}

#[derive(Debug, Deserialize)]
pub struct AppConfig {
    pub service_urls: ServiceConfig,
}

pub struct AppState {
    pub db_conn: Arc<Client>,
    pub executor_service: ExecutorServiceClient<Channel>,
    pub cpp_service: CompilerServiceClient<Channel>,
    pub go_service: CompilerServiceClient<Channel>,
    pub rust_service: CompilerServiceClient<Channel>,
    pub zig_service: CompilerServiceClient<Channel>,
    pub c_service: CompilerServiceClient<Channel>,
    pub python_service: CompilerServiceClient<Channel>,
    pub swift_service: CompilerServiceClient<Channel>,
    pub ruby_service: CompilerServiceClient<Channel>,
    pub grain_service: CompilerServiceClient<Channel>,
    pub config: AppConfig,
}

impl AppState {
    pub async fn new() -> Result<Self> {
        let db_conn = edgedb_tokio::create_client().await?;
        db_conn
            .ensure_connected()
            .await
            .context("Unable to connect to the edgedb instance")?;

        let config: AppConfig = get_figment_config()
            .extract()
            .context("Unable to extract configuration from environment")?;

        let executor_service = ExecutorServiceClient::connect(config.service_urls.executor.clone())
            .await
            .context("executor service")?;
        let cpp_service = CompilerServiceClient::connect(config.service_urls.cpp_service.clone())
            .await
            .context("cpp service")?;
        let go_service = CompilerServiceClient::connect(config.service_urls.go_service.clone())
            .await
            .context("go service")?;
        let rust_service = CompilerServiceClient::connect(config.service_urls.rust_service.clone())
            .await
            .context("rust service")?;
        let zig_service = CompilerServiceClient::connect(config.service_urls.zig_service.clone())
            .await
            .context("zig service")?;
        let c_service = CompilerServiceClient::connect(config.service_urls.c_service.clone())
            .await
            .context("c service")?;
        let python_service =
            CompilerServiceClient::connect(config.service_urls.python_service.clone())
                .await
                .context("python service")?;
        let swift_service =
            CompilerServiceClient::connect(config.service_urls.swift_service.clone())
                .await
                .context("swift service")?;
        let ruby_service = CompilerServiceClient::connect(config.service_urls.ruby_service.clone())
            .await
            .context("ruby service")?;
        let grain_service =
            CompilerServiceClient::connect(config.service_urls.grain_service.clone())
                .await
                .context("grain service")?;

        Ok(Self {
            db_conn: Arc::new(db_conn),
            executor_service,
            cpp_service,
            go_service,
            rust_service,
            zig_service,
            c_service,
            python_service,
            swift_service,
            ruby_service,
            grain_service,
            config,
        })
    }
}

pub async fn get_app_state() -> Result<AppState> {
    dotenv().ok();
    AppState::new().await
}
