mod resolver;
mod service;

use anyhow::Result;
use dotenv::dotenv;
use edgedb_tokio::Client as DbClient;
pub use resolver::{GraphqlSchema, MutationRoot, QueryRoot};
pub use service::Service;
use std::sync::Arc;

pub struct AppConfig {
    pub db_conn: Arc<DbClient>,
}

impl AppConfig {
    pub async fn new() -> Result<Self> {
        let db_conn = edgedb_tokio::create_client().await?;
        db_conn
            .ensure_connected()
            .await
            .expect("Unable to connect to the edgedb instance");
        Ok(Self {
            db_conn: Arc::new(db_conn),
        })
    }
}

pub async fn get_app_config() -> Result<AppConfig> {
    dotenv().ok();
    AppConfig::new().await
}
