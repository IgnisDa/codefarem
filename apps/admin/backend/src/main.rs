use admin_backend::{get_app_state, GraphqlSchema, MutationRoot, QueryRoot, Service};
use anyhow::Result;
use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    extract::Extension,
    http::Method,
    response::{Html, IntoResponse},
    routing::get,
    Router, Server,
};
use tower_http::cors::{Any, CorsLayer};
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
    let app_config = get_app_state().await?;
    let service = Service {
        db_conn: app_config.db_conn,
        mailer: app_config.mailer,
    };
    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(service)
        .finish();
    let server_url = get_server_url();
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(Any);
    let app = Router::new()
        .route("/graphql", get(graphiql).post(graphql_handler))
        .layer(Extension(schema))
        .layer(cors);
    Server::bind(&server_url.parse().unwrap())
        .serve(app.into_make_service())
        .await?;
    Ok(())
}
