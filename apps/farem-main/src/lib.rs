pub mod graphql;

use std::sync::Arc;

use anyhow::Result;
use config::JwtConfig;
use dotenv::dotenv;
use dotenv_codegen::dotenv;
use edgedb_tokio::{Builder as DbBuilder, Client as DbClient};
use figment::{providers::Env, Figment};
use surf::{Client as HttpClient, Config as HttpConfig, Url as HttpUrl};

pub struct AppConfig {
    pub db_conn: Arc<DbClient>,
    pub jwt_config: Arc<JwtConfig>,
    pub execute_client: Arc<HttpClient>,
    pub rust_farem_client: Arc<HttpClient>,
    pub cpp_farem_client: Arc<HttpClient>,
    pub go_farem_client: Arc<HttpClient>,
}

impl AppConfig {
    pub fn new(
        db_conn: DbClient,
        jwt_config: JwtConfig,
        execute_client: HttpClient,
        rust_farem_client: HttpClient,
        cpp_farem_client: HttpClient,
        go_farem_client: HttpClient,
    ) -> Self {
        Self {
            db_conn: Arc::new(db_conn),
            jwt_config: Arc::new(jwt_config),
            execute_client: Arc::new(execute_client),
            rust_farem_client: Arc::new(rust_farem_client),
            cpp_farem_client: Arc::new(cpp_farem_client),
            go_farem_client: Arc::new(go_farem_client),
        }
    }
}

pub async fn get_app_config() -> Result<AppConfig> {
    dotenv().ok();
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
    let rust_farem_client: HttpClient = HttpConfig::new()
        .set_base_url(HttpUrl::parse(dotenv!("RUST_FAREM_URL"))?)
        .try_into()?;
    let cpp_farem_client: HttpClient = HttpConfig::new()
        .set_base_url(HttpUrl::parse(dotenv!("CPP_FAREM_URL"))?)
        .try_into()?;
    let go_farem_client: HttpClient = HttpConfig::new()
        .set_base_url(HttpUrl::parse(dotenv!("GO_FAREM_URL"))?)
        .try_into()?;
    Ok(AppConfig::new(
        db_conn,
        jwt_config,
        execute_client,
        rust_farem_client,
        cpp_farem_client,
        go_farem_client,
    ))
}
