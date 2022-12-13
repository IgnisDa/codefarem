use async_graphql::{
    extensions::Analyzer,
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptySubscription, Schema,
};
use async_graphql_rocket::{GraphQLRequest, GraphQLResponse};
use orchestrator::{
    config::get_app_state,
    farem::service::FaremService,
    graphql::{MutationRoot, QueryRoot},
    learning::service::LearningService,
    users::service::UserService,
    utils::{RequestData, Token},
};
use rocket::{get, launch, post, response::content::RawHtml, routes, State};
use std::sync::Arc;

type GraphqlSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[get("/graphiql")]
fn graphiql() -> RawHtml<String> {
    RawHtml(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

#[post("/graphql", data = "<graphql_request>", format = "application/json")]
async fn graphql_request(
    schema: &State<GraphqlSchema>,
    user_token: Token,
    graphql_request: GraphQLRequest,
) -> GraphQLResponse {
    let request_data = RequestData {
        user_token: user_token.0,
    };
    let request = graphql_request.data(request_data).0;
    let response = schema.execute(request).await;
    GraphQLResponse::from(response)
}

#[launch]
async fn rocket() -> _ {
    let app_config = get_app_state().await.unwrap();
    let farem_service = FaremService::new(
        &app_config.executor_service,
        &app_config.cpp_compiler_service,
        &app_config.go_compiler_service,
        &app_config.rust_compiler_service,
    );
    let user_service = UserService::new(&app_config.db_conn);
    let learning_service =
        LearningService::new(&app_config.db_conn, &Arc::new(farem_service.clone()));
    let schema = Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
    .data(farem_service)
    .data(user_service)
    .data(learning_service)
    .extension(Analyzer)
    .finish();
    let mounter = rocket::build().manage(schema);
    mounter.mount("/", routes![graphiql, graphql_request])
}
