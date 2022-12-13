use anyhow::Result;
use auth::get_jwks_endpoint;
use dotenv::dotenv;
use edgedb_tokio::Client as DbClient;
use protobuf::generated::{
    compilers::compiler_service_client::CompilerServiceClient,
    executor::executor_service_client::ExecutorServiceClient,
};
use std::{env, sync::Arc};
use tonic::transport::Channel;

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
