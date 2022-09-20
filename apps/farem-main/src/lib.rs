pub mod graphql;

use std::sync::Arc;

use anyhow::Result;
use edgedb_tokio::Client;

pub async fn init_application() -> Result<(Arc<Client>,)> {
    let db = Arc::new(edgedb_tokio::create_client().await?);
    Ok((db,))
}
