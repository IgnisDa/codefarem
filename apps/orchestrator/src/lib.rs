pub mod farem;
pub mod graphql;
pub mod learning;
pub mod users;
pub mod utils;

use anyhow::Result;
use config::JwtConfig;
use dotenv::dotenv;
use edgedb_tokio::Client as DbClient;
use figment::{providers::Env, Figment};
use protobuf::generated::{
    compilers::compiler_service_client::CompilerServiceClient,
    executor::executor_service_client::ExecutorServiceClient,
};
use rocket::{
    async_trait,
    request::{FromRequest, Outcome},
    Request,
};
use std::{env, sync::Arc};
use tonic::transport::Channel;

pub struct AppConfig {
    pub db_conn: Arc<DbClient>,
    pub jwt_config: Arc<JwtConfig>,
    pub executor_service: ExecutorServiceClient<Channel>,
    pub cpp_compiler_service: CompilerServiceClient<Channel>,
    pub go_compiler_service: CompilerServiceClient<Channel>,
    pub rust_compiler_service: CompilerServiceClient<Channel>,
}

impl AppConfig {
    pub async fn new() -> Result<Self> {
        let db_conn = edgedb_tokio::create_client().await?;
        db_conn
            .ensure_connected()
            .await
            .expect("Unable to connect to the edgedb instance");
        let jwt_config = Figment::new()
            .merge(Env::prefixed("CODEFAREM_"))
            .extract::<JwtConfig>()?;

        let executor_service =
            ExecutorServiceClient::connect(env::var("CODEFAREM_EXECUTOR_URL")?).await?;
        let cpp_compiler_service =
            CompilerServiceClient::connect(env::var("CODEFAREM_CPP_COMPILER_URL")?).await?;
        let go_compiler_service =
            CompilerServiceClient::connect(env::var("CODEFAREM_GO_COMPILER_URL")?).await?;
        let rust_compiler_service =
            CompilerServiceClient::connect(env::var("CODEFAREM_RUST_COMPILER_URL")?).await?;

        Ok(Self {
            db_conn: Arc::new(db_conn),
            jwt_config: Arc::new(jwt_config),
            executor_service,
            cpp_compiler_service,
            go_compiler_service,
            rust_compiler_service,
        })
    }
}

pub async fn get_app_config() -> Result<AppConfig> {
    dotenv().ok();
    AppConfig::new().await
}

#[derive(Debug)]
pub struct RequestData {
    pub user_token: Option<String>,
    pub jwt_secret: Vec<u8>,
}

pub struct Token(pub Option<String>);

#[async_trait]
impl<'r> FromRequest<'r> for Token {
    type Error = String;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let token_str = request
            .headers()
            .get_one("authorization")
            .map(|f| f.to_string());
        let token = Token(token_str);
        Outcome::Success(token)
    }
}
