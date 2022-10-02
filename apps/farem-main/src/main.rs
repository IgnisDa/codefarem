use async_graphql::{
    extensions::Analyzer,
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptySubscription, Schema,
};
use async_graphql_rocket::{GraphQLRequest, GraphQLResponse};
use domains::{farem::service::FaremService, users::service::UserService, RequestData};
use farem_main::{
    get_app_config,
    graphql::{MutationRoot, QueryRoot},
};
use rocket::{get, launch, post, response::content::RawHtml, routes, State};

pub type GraphqlSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[get("/graphiql")]
fn graphiql() -> RawHtml<String> {
    RawHtml(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

#[post("/graphql", data = "<graphql_request>", format = "application/json")]
async fn graphql_request(
    schema: &State<GraphqlSchema>,
    request_data: RequestData,
    graphql_request: GraphQLRequest,
) -> GraphQLResponse {
    // insert data here using a single struct since this method can only be called once
    // dbg!(&graphql_request.0);
    let request = graphql_request.data(request_data).0;
    let response = schema.execute(request).await;
    GraphQLResponse::from(response)
}

#[launch]
async fn rocket() -> _ {
    let app_config = get_app_config().await.unwrap();
    let farem_service = FaremService::new(
        &app_config.db_conn,
        &app_config.execute_client,
        &app_config.rust_farem_client,
        &app_config.cpp_farem_client,
        &app_config.go_farem_client,
    );
    let user_service = UserService::new(&app_config.db_conn, &app_config.jwt_config);
    let schema = Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
    .data(farem_service)
    .data(user_service)
    .extension(Analyzer)
    .finish();
    rocket::build()
        .manage(schema)
        .mount("/", routes![graphiql, graphql_request])
}
