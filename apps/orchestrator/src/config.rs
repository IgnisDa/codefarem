use anyhow::Result;
use auth::get_jwks_endpoint;
use dotenv::dotenv;
use edgedb_tokio::Client as DbClient;
use protobuf::generated::{
    compilers::compiler_service_client::CompilerServiceClient,
    executor::executor_service_client::ExecutorServiceClient,
};
use serde::Deserialize;
use std::sync::Arc;
use tonic::transport::Channel;
use utilities::get_figment_config;

#[derive(Debug, Deserialize)]
struct JwtConfig {
    secret: String,
}

#[derive(Debug, Deserialize)]
struct ServiceConfig {
    executor: String,
    cpp_compiler: String,
    go_compiler: String,
    rust_compiler: String,
    authenticator: String,
}

#[derive(Debug, Deserialize)]
struct AppConfig {
    jwt: JwtConfig,
    service_urls: ServiceConfig,
}

pub struct AppState {
    pub db_conn: Arc<DbClient>,
    pub executor_service: ExecutorServiceClient<Channel>,
    pub cpp_compiler_service: CompilerServiceClient<Channel>,
    pub go_compiler_service: CompilerServiceClient<Channel>,
    pub rust_compiler_service: CompilerServiceClient<Channel>,
}

impl AppState {
    pub async fn new() -> Result<Self> {
        let db_conn = edgedb_tokio::create_client().await?;
        db_conn
            .ensure_connected()
            .await
            .expect("Unable to connect to the edgedb instance");

        let config: AppConfig = get_figment_config().extract()?;

        let executor_service = ExecutorServiceClient::connect(config.service_urls.executor).await?;
        let cpp_compiler_service =
            CompilerServiceClient::connect(config.service_urls.cpp_compiler).await?;
        let go_compiler_service =
            CompilerServiceClient::connect(config.service_urls.go_compiler).await?;
        let rust_compiler_service =
            CompilerServiceClient::connect(config.service_urls.rust_compiler).await?;

        Ok(Self {
            db_conn: Arc::new(db_conn),
            executor_service,
            cpp_compiler_service,
            go_compiler_service,
            rust_compiler_service,
        })
    }
}

pub async fn get_app_state() -> Result<AppState> {
    dotenv().ok();
    // TODO: Use a better way to check if required env vars are set
    // This throws an error if the JWT key is not set
    get_jwks_endpoint();
    AppState::new().await
}
