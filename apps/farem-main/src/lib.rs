pub mod graphql;

use std::sync::Arc;

use anyhow::Result;
use dotenv::dotenv;
use dotenv_codegen::dotenv;
use edgedb_tokio::{Builder as DbBuilder, Client as DbClient};
use surf::{Client as HttpClient, Config as HttpConfig, Url as HttpUrl};

pub async fn init_application() -> Result<(
    Arc<DbClient>,
    Arc<HttpClient>,
    Arc<HttpClient>,
    Arc<HttpClient>,
    Arc<HttpClient>,
)> {
    let config = DbBuilder::uninitialized()
        .read_instance("main_db")
        .await
        .unwrap()
        .build()
        .unwrap();
    let db = DbClient::new(&config);
    db.ensure_connected().await.unwrap();
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
    dotenv().ok();
    Ok((
        Arc::new(db),
        Arc::new(execute_client),
        Arc::new(rust_farem_client),
        Arc::new(cpp_farem_client),
        Arc::new(go_farem_client),
    ))
}
