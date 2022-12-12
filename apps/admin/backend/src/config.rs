use anyhow::Result;
use dotenv::dotenv;
use edgedb_tokio::Client;
use mailer::Mailer;
use std::sync::Arc;

pub struct AppConfig {
    pub db_conn: Arc<Client>,
    pub mailer: Arc<Mailer>,
}

impl AppConfig {
    pub async fn new() -> Result<Self> {
        let db_conn = edgedb_tokio::create_client().await?;
        db_conn
            .ensure_connected()
            .await
            .expect("Unable to connect to the edgedb instance");

        let mailer = Mailer::new()?;

        Ok(Self {
            db_conn: Arc::new(db_conn),
            mailer: Arc::new(mailer),
        })
    }
}

pub async fn get_app_config() -> Result<AppConfig> {
    dotenv().ok();
    AppConfig::new().await
}
