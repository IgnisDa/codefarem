pub mod graphql;

use std::{env, sync::Arc};

use anyhow::Result;
use config::JwtConfig;
use dotenv::dotenv;
use dotenv_codegen::dotenv;
use edgedb_tokio::{Builder as DbBuilder, Client as DbClient};
use figment::{providers::Env, Figment};
use protobuf::generated::compilers::compiler_service_client::CompilerServiceClient;
use surf::{Client as HttpClient, Config as HttpConfig, Url as HttpUrl};
use tonic::transport::Channel;

pub struct AppConfig {
    pub db_conn: Arc<DbClient>,
    pub jwt_config: Arc<JwtConfig>,
    pub execute_client: Arc<HttpClient>,
    pub cpp_compiler_service: CompilerServiceClient<Channel>,
    pub go_compiler_service: CompilerServiceClient<Channel>,
    pub rust_compiler_service: CompilerServiceClient<Channel>,
}

impl AppConfig {
    pub async fn new() -> Result<Self> {
        let db_conn = DbClient::new(
            &DbBuilder::uninitialized()
                .read_instance("main_db")
                .await
                .unwrap()
                .build()
                .unwrap(),
        );
        db_conn
            .ensure_connected()
            .await
            .expect("Unable to connect to the edgedb instance");
        let jwt_config = Figment::new()
            .merge(Env::prefixed("CODEFAREM_"))
            .extract::<JwtConfig>()?;
        let execute_client: HttpClient = HttpConfig::new()
            .set_base_url(HttpUrl::parse(dotenv!("EXECUTE_FAREM_URL"))?)
            .try_into()?;

        let cpp_compiler_service =
            CompilerServiceClient::connect(env::var("CPP_FAREM_URL")?).await?;
        let go_compiler_service = CompilerServiceClient::connect(env::var("GO_FAREM_URL")?).await?;
        let rust_compiler_service =
            CompilerServiceClient::connect(env::var("RUST_FAREM_URL")?).await?;

        Ok(Self {
            db_conn: Arc::new(db_conn),
            jwt_config: Arc::new(jwt_config),
            execute_client: Arc::new(execute_client),
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
