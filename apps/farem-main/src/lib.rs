pub mod graphql;

use std::sync::Arc;

use anyhow::Result;
use dotenv::dotenv;
use dotenv_codegen::dotenv;
use edgedb_tokio::Client;
use surf::{Client as HttpClient, Config as HttpConfig, Url as HttpUrl};

pub async fn init_application() -> Result<(Arc<Client>, Arc<HttpClient>)> {
    let db = Arc::new(edgedb_tokio::create_client().await?);
    let rust_farem_client: HttpClient = HttpConfig::new()
        .set_base_url(HttpUrl::parse(
            format!("{0}/farem", dotenv!("RUST_FAREM_URL")).as_str(),
        )?)
        .try_into()?;
    dotenv().ok();
    Ok((db, Arc::new(rust_farem_client)))
}