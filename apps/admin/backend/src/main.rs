use admin_backend::{get_app_config, GraphqlSchema, MutationRoot, QueryRoot, Service};
use anyhow::Result;
use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    extract::Extension,
    response::{Html, IntoResponse},
    routing::get,
    Router, Server,
};
use utilities::get_server_url;

async fn graphql_handler(schema: Extension<GraphqlSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

async fn graphiql() -> impl IntoResponse {
    Html(GraphiQLSource::build().finish())
}

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let app_config = get_app_config().await?;
    let service = Service {
        db_conn: app_config.db_conn,
        mailer: app_config.mailer,
    };
    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(service)
        .finish();
    let server_url = get_server_url();
    let app = Router::new()
        .route("/", get(graphiql).post(graphql_handler))
        .layer(Extension(schema));
    Server::bind(&server_url.parse().unwrap())
        .serve(app.into_make_service())
        .await?;
    Ok(())
}
