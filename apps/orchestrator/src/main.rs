use async_graphql::{extensions::Analyzer, http::GraphiQLSource, EmptySubscription, Schema};
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
async fn graphiql() -> RawHtml<String> {
    RawHtml(GraphiQLSource::build().endpoint("/graphql").finish())
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
    let app_state = get_app_state().await.unwrap();
    let farem_service = FaremService::new(
        &app_state.executor_service,
        &app_state.cpp_compiler_service,
        &app_state.go_compiler_service,
        &app_state.rust_compiler_service,
    );
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
    let mounter = rocket::build().manage(schema);
    mounter.mount("/", routes![graphiql, graphql_request])
}
