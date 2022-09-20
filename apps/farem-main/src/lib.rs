pub mod graphql;
pub mod services;

use std::sync::Arc;

use anyhow::Result;
use edgedb_tokio::Client;

#[derive(Debug)]
pub struct ApplicationContext {
    pub db_conn: Arc<Client>,
}

impl ApplicationContext {
    pub async fn init() -> Result<Self> {
        let db = Arc::new(edgedb_tokio::create_client().await?);
        Ok(Self { db_conn: db })
    }
}
