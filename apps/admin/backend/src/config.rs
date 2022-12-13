use anyhow::Result;
use dotenv::dotenv;
use edgedb_tokio::Client;
use mailer::Mailer;
use serde::Deserialize;
use std::sync::Arc;
use utilities::get_figment_config;

#[derive(Debug, Deserialize)]
struct FromConfig {
    name: String,
    email: String,
}

#[derive(Debug, Deserialize)]
struct SmtpConfig {
    host: String,
    port: u16,
    user: String,
    password: String,
    from: FromConfig,
}

#[derive(Debug, Deserialize)]
pub struct AppConfig {
    smtp: SmtpConfig,
}

pub struct AppState {
    pub db_conn: Arc<Client>,
    pub mailer: Arc<Mailer>,
}

impl AppState {
    pub async fn new() -> Result<Self> {
        let db_conn = edgedb_tokio::create_client().await?;
        db_conn
            .ensure_connected()
            .await
            .expect("Unable to connect to the edgedb instance");

        let config: AppConfig = get_figment_config().extract()?;

        let mailer = Mailer::new(
            config.smtp.host,
            config.smtp.port,
            config.smtp.user,
            config.smtp.password,
            config.smtp.from.name,
            config.smtp.from.email,
        )?;

        Ok(Self {
            db_conn: Arc::new(db_conn),
            mailer: Arc::new(mailer),
        })
    }
}

pub async fn get_app_state() -> Result<AppState> {
    dotenv().ok();
    AppState::new().await
}
