mod resolver;
mod service;

use std::sync::Arc;

use anyhow::Result;
use async_graphql::{http::GraphiQLSource, EmptyMutation, EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    extract::Extension,
    response::{Html, IntoResponse},
    routing::get,
    Router, Server,
};
use dotenv::dotenv;
use edgedb_tokio::Client as DbClient;
use resolver::{GraphqlSchema, QueryRoot};
use service::Service;
use utilities::get_server_url;

async fn graphql_handler(schema: Extension<GraphqlSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

async fn graphiql() -> impl IntoResponse {
    Html(GraphiQLSource::build().finish())
}

async fn init() -> Result<DbClient> {
    dotenv().ok();
    let db_conn = edgedb_tokio::create_client().await?;
    db_conn
        .ensure_connected()
        .await
        .expect("Unable to connect to the edgedb instance");
    Ok(db_conn)
}

#[tokio::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let db_conn = init().await.unwrap();
    let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
        .data(Service {
            db_conn: Arc::new(db_conn),
        })
        .finish();
    let server_url = get_server_url();
    let app = Router::new()
        .route("/", get(graphiql).post(graphql_handler))
        .layer(Extension(schema));
    Server::bind(&server_url.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
