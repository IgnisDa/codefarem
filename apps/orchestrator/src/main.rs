use async_graphql::{
    extensions::Analyzer, http::GraphiQLSource, parser::types::DocumentOperations,
    EmptySubscription, Schema,
};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    extract::Extension,
    http::{header::HeaderMap, StatusCode},
    response::{Html, IntoResponse},
    routing::{get, post},
    Router, Server,
};
use log::trace;
use orchestrator::{
    config::get_app_state,
    farem::service::FaremService,
    graphql::{MutationRoot, QueryRoot},
    learning::service::LearningService,
    users::service::UserService,
    utils::get_token_from_headers,
};
use std::sync::Arc;
use utilities::get_server_url;

type GraphqlSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "Nothing to see here!")
}

async fn graphiql() -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/graphql").finish())
}

async fn graphql_handler(
    Extension(schema): Extension<GraphqlSchema>,
    headers: HeaderMap,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let mut request = req.into_inner();
    let query = request.parsed_query().expect("Failed to parse query");
    match &query.operations {
        DocumentOperations::Multiple(x) => {
            for key in x.keys() {
                trace!("Operation name: {key:?}");
            }
        }
        DocumentOperations::Single(_) => {}
    }
    if let Some(token) = get_token_from_headers(&headers) {
        request = request.data(token);
    }
    schema.execute(request).await.into()
}

#[tokio::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let app_state = get_app_state().await.unwrap();
    let farem_service = FaremService::new(
        &app_state.executor_service,
        &app_state.cpp_service,
        &app_state.go_service,
        &app_state.rust_service,
        &app_state.zig_service,
        &app_state.c_service,
        &app_state.python_service,
        &app_state.swift_service,
        &app_state.ruby_service,
        &app_state.grain_service,
    );
    farem_service.initialize().await;
    let user_service = UserService::new(&app_state.db_conn);
    let learning_service =
        LearningService::new(&app_state.db_conn, &Arc::new(farem_service.clone()));
    let schema = Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
    .data(farem_service)
    .data(user_service)
    .data(learning_service)
    .data(app_state.config)
    .extension(Analyzer)
    .finish();

    let app = Router::new()
        .route("/graphiql", get(graphiql).fallback(handler_404))
        .route("/graphql", post(graphql_handler).fallback(handler_404))
        .fallback(handler_404)
        .layer(Extension(schema));

    let server_url = get_server_url();
    Server::bind(&server_url.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
