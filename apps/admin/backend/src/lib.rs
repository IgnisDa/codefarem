mod dto;
mod resolver;
mod service;

use anyhow::Result;
use dotenv::dotenv;
use edgedb_tokio::Client;
use lettre::{transport::smtp::authentication::Credentials, SmtpTransport};
pub use resolver::{GraphqlSchema, MutationRoot, QueryRoot};
pub use service::Service;
use std::{env, sync::Arc};

pub struct AppConfig {
    pub db_conn: Arc<Client>,
    pub mailer: Arc<SmtpTransport>,
}

impl AppConfig {
    pub async fn new() -> Result<Self> {
        let db_conn = edgedb_tokio::create_client().await?;
        db_conn
            .ensure_connected()
            .await
            .expect("Unable to connect to the edgedb instance");

        let smtp_host = env::var("SMTP_HOST")?;
        let smtp_port = env::var("SMTP_PORT")?.parse::<u16>()?;
        let smtp_username = env::var("SMTP_USER")?;
        let smtp_password = env::var("SMTP_PASSWORD")?;

        let credentials = Credentials::new(smtp_username, smtp_password);

        let mailer = if cfg!(debug_assertions) {
            SmtpTransport::builder_dangerous(&smtp_host)
                .port(smtp_port)
                .credentials(credentials)
                .build()
        } else {
            SmtpTransport::relay(&smtp_host)
                .unwrap()
                .credentials(credentials)
                .build()
        };

        mailer.test_connection()?;

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
